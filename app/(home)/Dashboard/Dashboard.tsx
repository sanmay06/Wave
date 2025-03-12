import React, { useState, useEffect, useContext } from "react";
import { View, Text, Switch, Alert, Button, TextInput, ScrollView, StyleSheet, Linking, Dimensions, Pressable } from "react-native";
import { getDatabase, ref, onValue, set, query, orderByKey, limitToLast, push, get } from "firebase/database";
import { database } from "../../../firebaseConfig";
import { auth } from "../../../firebaseConfig";
import { ThemeContext } from "@/hooks/ThemeProvider";
import Menu  from "@/components/ui/Menu";
import { StackNavigationProp } from "@react-navigation/stack";
import Light from "@/components/ui/Lights";

type RootStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  'room/[id]': { id: string };
};
// Define the navigation prop type for Dashboard
type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, "Dashboard">;

// Define the props for Dashboard
type DashboardProps = {
  navigation: DashboardScreenNavigationProp;
};


const getData = async (path: string, setData: any) => {
  const snapshot = await get(ref(database, path)); // Root reference

  if (snapshot.exists()) {
    console.log("Database Structure:", JSON.stringify(snapshot.val(), null, 2));
    let obj = snapshot.val();
    // console.log("VALUES:", obj.values());
    setData(Object.values(snapshot.val()));
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

  const [light1, setLight1] = useState<boolean>(false);
  const [light2, setLight2] = useState<boolean>(false);
  const [light3, setLight3] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<string>("");
  const [pitemp, setPitemp] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [battery, setBattery] = useState<string>("");
  const [scheduledOnTime, setScheduledOnTime] = useState<string>("");
  const [scheduledOffTime, setScheduledOffTime] = useState<string>("");
  const [rooms, setRooms] = useState<any>("");

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const lightOnRef = ref(database, "schedule/light_schedule_on");
    const lightOffRef = ref(database, "schedule/light_schedule_off");


    const getLatestValue = (refPath: string, setState: Function) => {
      const refQuery = query(ref(database, refPath), orderByKey(), limitToLast(1));
      onValue(refQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const latestKey = Object.keys(data)[0]; 
          const latestValue = data[latestKey];
          setState(latestValue); 
        }
      });
    };

    getData("/ef16bute/rooms", setRooms);
    console.log(rooms);
    // Fetch most recent light status
    getLatestValue("light1", (value: number) => setLight1(value === 1));
    getLatestValue("light2", (value: number) => setLight2(value === 1));
    getLatestValue("light3", (value: number) => setLight3(value === 1));

    // Fetch most recent sensor data
    getLatestValue("pitemp", setPitemp);
    getLatestValue("temp", setTemperature);
    getLatestValue("humidity", setHumidity);
    getLatestValue("btry", setBattery);

    // Fetch scheduled ON/OFF times
    onValue(lightOnRef, (snapshot) => snapshot.exists() && setScheduledOnTime(snapshot.val()));
    onValue(lightOffRef, (snapshot) => snapshot.exists() && setScheduledOffTime(snapshot.val()));

  }, []);

  useEffect(() => {
    console.log(rooms);
  }, [rooms]);

  // Function to push 0 or 1 to Firebase for controlling lights
  const toggleLight = (light: string, state: boolean) => {
    const lightState: number = state ? 1 : 0; // Convert boolean to 0/1

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
  };

  const DisplayRooms = () => {
    if(rooms) {
      // console.log(Object.values(rooms));
      return rooms.map((room: any) => {
        return (
          <Rooms theme = {theme}/>
        );
      });
   }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Menu navigation={navigation}/>
      <View style={styles.container}>
        {/* <Text style={styles.title}>WAVE</Text>
        <Text style={styles.subtitle}>By Automattrix</Text> */}

        {/* Sensor Data Display */}
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
        <View style={{flexDirection: 'row'}}>
          {DisplayRooms()}
        </View>

        {/* Light Control */}
        <View style={styles.cardContainer}>
          <Light light = {light1} setLight = {setLight1} toggleLight = {toggleLight} theme = {theme} name = {"Light 1"}/>

          <Light light = {light2} setLight = {setLight2} toggleLight = {toggleLight} theme = {theme} name = {"Light 2"}/>
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

        {/* Scheduled Times 
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
        </View>*/}

      </View>
      <Pressable style = {styles.button} onPress={() => navigation.navigate("room/[id]", { id : '123'})} >
        <Text style={{color: theme.text}}>Rooms</Text>
      </Pressable>
    </ScrollView>
  );
}

export default Dashboard;

const Rooms = ( props: any ) => {
  
  const theme = props.theme;
  const width = 1;
  const screenWidth = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.background,
      height: screenWidth * 0.1,
      width: screenWidth * 0.1,
      borderRadius: 25,
      padding: 20,
      margin:15,
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
  });

  return (
    <View style={styles.card}>
      <Pressable onPress={() => console.log("Rooms")}>
        <Text style={styles.cardTitle}>Rooms</Text>
      </Pressable>
    </View>
  );
};