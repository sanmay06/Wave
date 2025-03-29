import React, { useState, useEffect, useContext } from "react";
import { View, Text, Switch, Alert, Button, TextInput, ScrollView, StyleSheet, Linking, Dimensions, Pressable } from "react-native";
import { getDatabase, ref, onValue, set, query, orderByKey, limitToLast, push, get, update } from "firebase/database";
import { database } from "../../../firebaseConfig";
import { auth } from "../../../firebaseConfig";
import { ThemeContext } from "@/hooks/ThemeProvider";
import Menu  from "@/components/ui/Menu";
import { StackNavigationProp } from "@react-navigation/stack";
import Light from "@/components/ui/Lights";
import Fan from "@/components/ui/Fan";
import Outlet from "@/components/ui/Outlets";
import useAuth from "@/hooks/Auth";

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
    // console.log("Database Structure:", JSON.stringify(snapshot.val(), null, 2));
    let obj = snapshot.val();
    // console.log("VALUES:", obj.values());
    // setData(Object.values(snapshot.val()));
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
  const [temperature, setTemperature] = useState<string>("");
  const [pitemp, setPitemp] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [battery, setBattery] = useState<string>("");
  const [scheduledOnTime, setScheduledOnTime] = useState<string>("");
  const [scheduledOffTime, setScheduledOffTime] = useState<string>("");
  const [rooms, setRooms] = useState<any>("");
  const [data, setData] = useState<any>("");
  const [ deviceId, setDeviceId ] = useState<string>();
    
  const { user }: { user: any | null } = useAuth();

  useEffect(() => {
      if(user && user.photoURL) {
          setDeviceId(user.photoURL as string);
      }
      console.log("Device ID:", deviceId);
  }, [user]);

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
          // If the value is an object, get its value
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
    // console.log(rooms);
    getData(`/${deviceId}`, setData);
    // console.log(data);
    // Fetch most recent light status
    // getLatestValue("light1", (value: number) => setLight1(value === 1));
    // getLatestValue("light2", (value: number) => setLight2(value === 1));
    // getLatestValue("light3", (value: number) => setLight3(value === 1));

    // Fetch most recent sensor data
    getLatestValue(`/${deviceId}/pitemp`, setPitemp);
    getLatestValue(`/${deviceId}/temp`, setTemperature);
    getLatestValue(`/${deviceId}/humidity`, setHumidity);
    getLatestValue(`/${deviceId}/btry`, setBattery);

    // Fetch scheduled ON/OFF times
    onValue(lightOnRef, (snapshot) => snapshot.exists() && setScheduledOnTime(snapshot.val()));
    onValue(lightOffRef, (snapshot) => snapshot.exists() && setScheduledOffTime(snapshot.val()));

  }, [deviceId]);

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
      // console.log(rooms);
      return Object.values(rooms).map((room: any, index: number) => {
        return (
          <Rooms theme = {theme} name = {room.name} nav = {navigation} id = {index} key = {index}/>
          
        );
      });
   }
  }

  const generateTestData = async () => {
    if (!deviceId) {
      Alert.alert("Error", "Device ID not found");
      return;
    }

    const now = Date.now();
    const sensors = ['temp', 'humidity', 'btry', 'pitemp'] as const;
    
    // Generate 20 readings for each sensor
    for (let i = 0; i < 20; i++) {
      const timestamp = now - (i * 5 * 60 * 1000); // 5 minutes apart
      
      // Generate realistic test data
      const testData: Record<string, string> = {
        temp: (20 + Math.random() * 5).toFixed(1), // 20-25°C
        humidity: (40 + Math.random() * 20).toFixed(1), // 40-60%
        btry: (80 + Math.random() * 20).toFixed(1), // 80-100%
        pitemp: (35 + Math.random() * 10).toFixed(1), // 35-45°C
      };

      // Push data for each sensor
      for (const sensor of sensors) {
        const sensorRef = ref(database, `/${deviceId}/${sensor}/${timestamp}`);
        await set(sensorRef, testData[sensor]); // Changed from update to set
      }
    }

    // Generate test rooms if they don't exist
    const roomsRef = ref(database, `/${deviceId}/rooms`);
    const roomsSnapshot = await get(roomsRef);
    
    if (!roomsSnapshot.exists()) {
      const testRooms = {
        room1: {
          name: "Living Room",
          devices: ["light1", "light2", "fan1"]
        },
        room2: {
          name: "Bedroom",
          devices: ["light3", "fan2"]
        },
        room3: {
          name: "Kitchen",
          devices: ["light4", "fan3"]
        }
      };
      
      await set(roomsRef, testRooms); // Changed from update to set
    }

    Alert.alert("Success", "Test data generated successfully!");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Menu navigation={navigation}/>
      <View style={styles.container}>
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

        <Button title="Generate Test Data" onPress={generateTestData} />

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
    </ScrollView>
  );
}

export default Dashboard;

const Rooms = ( props: any ) => {
  
  const theme = props.theme;
  const width = 1;
  const screenWidth = Dimensions.get('window').width;
  const navigation = props.nav;

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
    <Pressable onPress={() => navigation.navigate("room/[id]", { id : props.id + 1})} >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{props.name}</Text>
      </View>
    </Pressable>
  );
};