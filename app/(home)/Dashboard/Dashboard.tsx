import React, { useState, useEffect } from "react";
import { View, Text, Switch, Alert, Button, TextInput, ScrollView, StyleSheet, Linking } from "react-native";
import { getDatabase, ref, onValue, set, query, orderByKey, limitToLast, push } from "firebase/database";
import { database } from "../../../firebaseConfig"; // Adjust path if needed
import { auth } from "../../../firebaseConfig";

export default function Dashboard() {
  console.log(auth.currentUser)
  const [light1, setLight1] = useState<boolean>(false);
  const [light2, setLight2] = useState<boolean>(false);
  const [light3, setLight3] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<string>("");
  const [pitemp, setPitemp] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [battery, setBattery] = useState<string>("");
  const [scheduledOnTime, setScheduledOnTime] = useState<string>("");
  const [scheduledOffTime, setScheduledOffTime] = useState<string>("");

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const light1Ref = ref(database, "light1");
    const light2Ref = ref(database, "light2");
    const light3Ref = ref(database, "light3");
    const tempRef = ref(database, "temp");
    const humidityRef = ref(database, "humidity");
    const batteryRef = ref(database, "btry");
    const pitempRef = ref(database, "pitemp");
    const lightOnRef = ref(database, "schedule/light_schedule_on");
    const lightOffRef = ref(database, "schedule/light_schedule_off");

    // Fetch the most recent data for lights and sensor values
    const getLatestValue = (refPath: string, setState: Function) => {
      const refQuery = query(ref(database, refPath), orderByKey(), limitToLast(1));
      onValue(refQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const latestKey = Object.keys(data)[0]; // Get the most recent key
          const latestValue = data[latestKey];
          setState(latestValue); // Update the state with the latest value
        }
      });
    };

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

  // Open the web page
  const openWebPage = () => {
    const url = "https://delicate-puffpuff-27a76f.netlify.app/setting"; // Replace with your desired URL
    Linking.openURL(url).catch((err: any) => console.error("Failed to open URL:", err));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>WAVE</Text>
        <Text style={styles.subtitle}>By Automattrix</Text>

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

        {/* Light Control */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Light 1</Text>
          <Switch
            value={light1}
            onValueChange={(value: boolean) => {
              setLight1(value);
              toggleLight("light1", value);
            }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Light 2</Text>
          <Switch
            value={light2}
            onValueChange={(value: boolean) => {
              setLight2(value);
              toggleLight("light2", value);
            }}
          />
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

        {/* Web Page Button */}
        <View style={styles.card}>
          <Button title="Go to Analysis page" onPress={openWebPage} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  cardValue: {
    fontSize: 24,
    color: "#007BFF",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
});
