import React, { useState, useEffect, useContext } from "react";
import { View, Text, Switch, Alert, Button, TextInput, ScrollView, StyleSheet, Linking, Dimensions, Pressable } from "react-native";
import { ref, onValue, set, query, orderByKey, limitToLast, push, get } from "firebase/database";
import { MotiView } from "moti";
import { database } from "../../../firebaseConfig";
import { ThemeContext } from "@/hooks/ThemeProvider";
import Menu  from "@/components/ui/Menu";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRoute } from "@react-navigation/native";
import RadialBackground from "@/components/ui/Background";

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
    // console.log("Data fetched:", obj);
  } else {
    console.log("No data available");
  }
};

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {  
  const { theme } = useContext<any>(ThemeContext); // Correctly calling useContext inside the component
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      padding: 20,
    },
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: 'transparent',
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
    compText: {
      fontSize: 20,
      color: theme.secondary,
      backgroundColor: theme.primary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginBottom: 8,
      borderRadius: 4,
  }
  });

  const [light, setLight] = useState<boolean>(false);
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
  const [ chnages, setChanges ] = useState<any>({});
  const route:any = useRoute();
  // console.log('route:',route.params);

  useEffect(() => {
    if (route?.params?.deviceID) {
      setDeviceId(route.params.deviceID);
    } else {
      // console.log("No device ID provided");
      Alert.alert("Error", "No device ID provided.");
    }
  }, []);

  const updateRoomName = (roomId: string, newName: string) => {
    if(edit === false)
      return;
    setEdit(false);
    set(ref(database,`${deviceId}/rooms/room${roomId}/name`), newName)
    .then(() =>{ 
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
    if(deviceId != '') {
      const lightOnRef = ref(database, `${deviceId}/schedule/light_schedule_on`);
      const lightOffRef = ref(database, `${deviceId}/schedule/light_schedule_off`);


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
      getData(`/${deviceId}/masterSwitch`, setLight);
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
    const State: number = state ? 1 : 0;

    set(ref(database, `${deviceId}/masterSwitch`), State)
      // .then(() => console.log(`Switch updated to ${State}`))
      .catch((error) => {
        console.error("Error updating light state:", error);
        Alert.alert("Error", "Failed to update light state.");
      });
  };

  // Function to update the scheduled times in Firebase
  const saveSchedule = () => {
    const lightOnRef = ref(database, `${deviceId}/schedule/light_schedule_on`);
    const lightOffRef = ref(database, `${deviceId}/schedule/light_schedule_off`);


    if (scheduledOnTime && scheduledOffTime) {
      set(lightOnRef, scheduledOnTime)
        // .then(() => console.log("Scheduled ON time saved:", scheduledOnTime))
        .catch((error) => {
          console.error("Error saving scheduled ON time:", error);
          Alert.alert("Error", "Failed to save scheduled ON time.");
        });

      set(lightOffRef, scheduledOffTime)
        // .then(() => console.log("Scheduled OFF time saved:", scheduledOffTime))
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
      // console.log(rooms);
      return Object.values(rooms).map((room: any, index: number) => {
        return (
          <Rooms theme = {theme} deviceID = {deviceId} name = {room.name} nav = {navigation} id = {index} key = {index} edit = {edit} setEdit = {setEdit} changes = {chnages} setChanges = {setChanges} />
        );
      });
   }
  }

  const updateRooms = () => {
    // console.log('chnages:',chnages);
    for(const [key, value] of Object.entries(chnages)) {
      updateRoomName(key as string, value as string);
    }
  }

  return (
    <View style = {{ flex :1 }}>
      <RadialBackground />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
      >
        <Menu navigation={navigation}/>
        <View style={styles.container}>
          <Pressable onPress={() => updateRooms()}>
            <MotiView 
              style={styles.card}
              from={{ opacity: 0, translateY: -50 }}
              animate={{ opacity: 1, translateY: 0 }}
            >
              <Text style={styles.cardTitle}>Temperature</Text>
              <Text style={styles.cardValue}>{temperature}°C</Text>
              <Text style={styles.cardTitle}>Humidity</Text>
              <Text style={styles.cardValue}>{humidity}%</Text>
              <Text style={styles.cardTitle}>Battery</Text>
              <Text style={styles.cardValue}>{battery}%</Text>
              <Text style={styles.cardTitle}>Pi Temperature</Text>
              <Text style={styles.cardValue}>{pitemp}</Text>
            </MotiView>
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.compText}>Rooms</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {DisplayRooms()}
              </View>
            </View>
          

            <View style={{backgroundColor: theme.background, borderRadius: 25, padding: 20, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, elevation: 5, borderColor: theme.border, borderWidth: 1,flexDirection: 'row', justifyContent: 'space-between', width: '80%', }}>
              <Text style={styles.cardTitle}>Master Switch</Text>
              <Switch
                value={light}
                onValueChange={(value: boolean) => {
                  setLight(value);
                  toggleLight("light3", value);
                }}
              />
            </View>
              
            <View style={styles.card}>
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
    </View>
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
    // console.log('changes:',props.changes);
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
      onPress={() => !props.edit ? navigation.navigate("room/[id]", { id: props.id + 1, deviceID: props.deviceID }) : null}
      onLongPress={() => props.setEdit(true)}
    >
      <MotiView 
        style={styles.card}
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
      >
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
      </MotiView>
    </Pressable>
  );
};
