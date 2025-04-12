import React, { useState, useEffect, useContext } from "react";
import { View, Text, Switch, Alert, Button, TextInput, ScrollView, StyleSheet, Linking, Dimensions, Pressable } from "react-native";
import { ref, onValue, set, query, orderByKey, limitToLast, push, get } from "firebase/database";
import { database } from "../../../firebaseConfig";
import { ThemeContext } from "@/hooks/ThemeProvider";
import Menu  from "@/components/ui/Menu";
import { StackNavigationProp } from "@react-navigation/stack";
import useAuth from "@/hooks/Auth";
import { showTemp } from "@/utils/notifications";

type RootStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  'room/[id]': { id: string };
};
type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, "Dashboard">;

type DashboardProps = {
  navigation: DashboardScreenNavigationProp;
};

const getData = async (path: string, setData: any) => {
  const snapshot = await get(ref(database, path)); 

  if (snapshot.exists()) {
    let obj = snapshot.val();
    setData(obj);
  } else {
    console.log("No data available");
  }
};

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {  const { theme } = useContext<any>(ThemeContext); // Correctly calling useContext inside the component
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.text,
    },
    subtitle: {
      fontSize: 16,
      color: theme.labelText,
      textAlign: "center",
    },
    card: {
      backgroundColor: theme.background,
      borderRadius: 25,
      padding: 20,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5,
      borderColor: theme.border,
      borderWidth: 1,
    },
    cardTitle: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: "bold",
      color: theme.text,
    },
    cardValue: {
      fontSize: 24,
      color: theme.primary,
    },
    input: {
      height: 40,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 10,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.background,
    },
    button: {
      backgroundColor: theme.button.background,
      color: theme.button.color,
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    cardContainer: {
      flexDirection: "row",
    },
    buttonText: {
      color: theme.button.color,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  const [light3, setLight3] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<string>("");
  const [pitemp, setPitemp] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [battery, setBattery] = useState<string>("");
  const [scheduledOnTime, setScheduledOnTime] = useState<string>("");
  const [scheduledOffTime, setScheduledOffTime] = useState<string>("");
  const [rooms, setRooms] = useState<any>("");
  const [data, setData] = useState<any>("");
  const [ deviceId, setDeviceId ] = useState<string>('');
  const { user }: { user: any | null } = useAuth();
  const [ chnages, setChanges ] = useState<any>({});

  const updateRoomName = (roomId: string, newName: string) => {
    setEdit(false);
    set(ref(database,`${deviceId}/rooms/room${roomId}/name`), newName)
    .then(() =>{ 
      console.log(`Room ${roomId} name updated to ${newName}`)
      getData(`/${deviceId}/rooms`, setRooms);
      setRooms(Object.values(rooms));
  })
    .catch((error) => {
      console.error("Error updating room name:", error);
      Alert.alert("Error", "Failed to update room name.");
    });
    setRooms((prevRooms: any) => ({ ...prevRooms, [`room${roomId}`]: { ...prevRooms[`room${roomId}`], name: newName } }));
  };

  useEffect(() => {
    console.log(user)
      if(user && user.photoURL) {
          setDeviceId(user.photoURL as string);
      }
      console.log("Device ID:", deviceId);
  }, [user]);

  useEffect(() => {
    if(deviceId != '') {
      const lightOnRef = ref(database, "schedule/light_schedule_on");
      const lightOffRef = ref(database, "schedule/light_schedule_off");


      const getLatestValue = (refPath: string, setState: Function) => {
        const refQuery = query(ref(database, refPath), orderByKey(), limitToLast(1));
        onValue(refQuery, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const latestKey = Object.keys(data)[0]; 
            const latestValue = data[latestKey];
            if (typeof latestValue === 'object') {
              const valueKey = Object.keys(latestValue)[0];
              setState(String(latestValue[valueKey]));
            } else {
              setState(String(latestValue));
            }
          }
        });
      };

      getData(`/${deviceId}/rooms`, setRooms);
      setRooms(Object.values(rooms));
      getData('/', setData);
      console.log('data:',data);
      getLatestValue(`/${deviceId}/pitemp`, setPitemp);
      getLatestValue(`/${deviceId}/temp`, setTemperature);
      getLatestValue(`/${deviceId}/humidity`, setHumidity);
      getLatestValue(`/${deviceId}/btry`, setBattery);

      onValue(lightOnRef, (snapshot) => snapshot.exists() && setScheduledOnTime(snapshot.val()));
      onValue(lightOffRef, (snapshot) => snapshot.exists() && setScheduledOffTime(snapshot.val()));
    }
  }, [deviceId]);

  const toggleLight = (light: string, state: boolean) => {
    const lightState: number = state ? 1 : 0;

    push(ref(database, `${light}`), lightState)
      .then(() => console.log(`Light ${light} updated to ${lightState}`))
      .catch((error) => {
        console.error("Error updating light state:", error);
        Alert.alert("Error", "Failed to update light state.");
      });
  };

  // Function to update the scheduled times in Firebase
  const saveSchedule = () => {
    const lightOnRef = ref(database, "schedule/light_schedule_on");
    const lightOffRef = ref(database, "schedule/light_schedule_off");

    if (scheduledOnTime && scheduledOffTime) {
      set(lightOnRef, scheduledOnTime)
        .then(() => console.log("Scheduled ON time saved:", scheduledOnTime))
        .catch((error) => {
          console.error("Error saving scheduled ON time:", error);
          Alert.alert("Error", "Failed to save scheduled ON time.");
        });

      set(lightOffRef, scheduledOffTime)
        .then(() => console.log("Scheduled OFF time saved:", scheduledOffTime))
        .catch((error) => {
          console.error("Error saving scheduled OFF time:", error);
          Alert.alert("Error", "Failed to save scheduled OFF time.");
        });
    } else {
      Alert.alert("Error", "Please provide both ON and OFF times.");
    }
  }

  const DisplayRooms = () => {
    // console.log(rooms);
    if(rooms) {
      console.log(rooms);
      return Object.values(rooms).map((room: any, index: number) => {
        return (
          <Rooms theme = {theme} name = {room.name} nav = {navigation} id = {index} key = {index} edit = {edit} setEdit = {setEdit} changes = {chnages} setChanges = {setChanges} />
        );
      });
   }
  }

  const updateRooms = () => {
    console.log('chnages:',chnages);
    for(const [key, value] of Object.entries(chnages)) {
      updateRoomName(key as string, value as string);
    }
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
    >
      <Menu navigation={navigation}/>
      {/* <Pressable
        style = {{backgroundColor: 'white'}}
        onPress={createRooms}
      ><Text style = {{color: 'black'}}>Click Me </Text></Pressable> */}
      <View style={styles.container}>
        <Pressable onPress={() => updateRooms()}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Temperature</Text>
            <Text style={styles.cardValue}>{temperature}°C</Text>
            <Text style={styles.cardTitle}>Humidity</Text>
            <Text style={styles.cardValue}>{humidity}%</Text>
            <Text style={styles.cardTitle}>Battery</Text>
            <Text style={styles.cardValue}>{battery}%</Text>
            <Text style={styles.cardTitle}>Pi Temperature</Text>
            <Text style={styles.cardValue}>{pitemp}</Text>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {DisplayRooms()}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Light 3</Text>
            <Switch
              value={light3}
              onValueChange={(value: boolean) => {
                setLight3(value);
                toggleLight("light3", value);
              }}
            />
            <Text style={styles.cardTitle}>Scheduled ON Time</Text>
            <TextInput
              style={styles.input}
              value={scheduledOnTime}
              onChangeText={setScheduledOnTime}
              placeholder="HH:MM"
            />
            <Text style={styles.cardTitle}>Scheduled OFF Time</Text>
            <TextInput
              style={styles.input}
              value={scheduledOffTime}
              onChangeText={setScheduledOffTime}
              placeholder="HH:MM"
            />
            <Button title="Save Schedule" onPress={saveSchedule} />
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default Dashboard;

const Rooms = (props: any) => {

  const [ name, setName ] = useState<string>(props.name);
  const theme = props.theme;
  const { width, height } = Dimensions.get("window");
  const isPortrait = height > width;
  const cardSize = isPortrait ? width * 0.3 : width * 0.15;
  const navigation = props.nav;

  useEffect(() => {
    props.setChanges( (prev: any) => {
      return { ...prev, [props.id + 1]: name };
    });
    console.log('changes:',props.changes);
  }, [name]);
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.background,
      width: cardSize,
      height: cardSize,
      borderRadius: cardSize / 10,
      padding: 15,
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5,
      borderColor: theme.border,
      borderWidth: 1,
    },
    cardTitle: {
      fontSize: cardSize / 6,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
    },
    input: {
      fontSize: cardSize / 6,
      fontWeight: "bold",
      width: cardSize * 0.8,
      color: theme.text,
      textAlign: "center",
      borderWidth: 1,
      borderColor: 'white',
    },
  });

  return (
    <Pressable 
      onPress={() => !props.edit ? navigation.navigate("room/[id]", { id: props.id + 1 }) : null}
      onLongPress={() => props.setEdit(true)}
    >
      <View style={styles.card}>
        {
          props.edit ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          ):(
            <Text style={styles.cardTitle}>{name}</Text>
          )
        }
      </View>
    </Pressable>
  );
};
