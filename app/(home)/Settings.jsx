import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { ActivityIndicator, Card, Title } from 'react-native-paper';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebaseConfig';
import { ThemeContext } from '@/hooks/ThemeProvider';
import ThemeButton from '@/components/ui/ThemeButton';
import Svg, { Path, Circle, Text } from 'react-native-svg';

const db = database;
const screenWidth = Dimensions.get('window').width;
const MAX_VISIBLE_POINTS = 4;

const Settings = () => {
  const { theme } = useContext(ThemeContext);
  
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [battery, setBattery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distbtry, setDistbtry] = useState([]);
  const [pitemp, setPitemp] = useState([]);

  useEffect(() => {
    const fetchData = (refPath, setData) => {
      const dataRef = ref(db, refPath);
      onValue(dataRef, (snapshot) => {
        if (snapshot.exists()) {
          let rawData = Object.values(snapshot.val());
          const cleanedData = rawData
            .map(value => parseFloat(value))
            .filter(value => !isNaN(value) && isFinite(value));
          
          setData(cleanedData.length ? cleanedData.slice(-MAX_VISIBLE_POINTS) : [0]);
        } else {
          setData([0]);
        }
      });
    };

    fetchData('temp/', setTemperature);
    fetchData('humidity/', setHumidity);
    fetchData('btry/', setBattery);
    fetchData('distbtry/', setDistbtry);
    fetchData('pitemp/', setPitemp);

    console.log(temperature)

    setLoading(false);
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemeButton />
      <Title style={[styles.header, { color: theme.primary }]}>Sensor Data</Title>

      {loading ? (
        <ActivityIndicator animating={true} color={theme.primary} size="large" />
      ) : (
        <>
          <DataCard title="Temperature (°C)" data={temperature} theme={theme} />
          <DataCard title="Humidity (%)" data={humidity} theme={theme} />
          <DataCard title="Sensor Battery (%)" data={battery} theme={theme} />
          <DataCard title="Dist Battery (%)" data={distbtry} theme={theme} />
          <DataCard title="Pi Temperature (°C)" data={pitemp} theme={theme} />
        </>
      )}
    </ScrollView>
  );
};

const DataCard = ({ title, data, theme }) => {
  const chartWidth = screenWidth * 0.80;
  const chartHeight = 200;
  const minY = Math.min(...data);
  const maxY = Math.max(...data);

  // Ensure min-max difference for better visualization
  const buffer = 0.5;
  const adjustedMinY = minY - buffer;
  const adjustedMaxY = maxY + buffer;

  const pathData = generatePath(data, chartWidth, chartHeight, adjustedMinY, adjustedMaxY);
  const points = generatePoints(data, chartWidth, chartHeight, adjustedMinY, adjustedMaxY);

  return (
    <Card style={[styles.card, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
      <Card.Content>
        <Title style={{ color: theme.text }}>{title}</Title>
        <View style={{ height: chartHeight, width: chartWidth}}>
          <Svg height={chartHeight + 20} width={chartWidth + 60} viewBox={`-10 -10 ${chartWidth + 70} ${chartHeight + 30}`}>

            {/* Line Path */}
            <Path d={pathData} stroke={theme.primary} strokeWidth="2" fill="none" />

            {/* Dots & Labels */}
            {points.map((point, index) => (
              <React.Fragment key={index}>
                {/* Dot at Data Point */}
                <Circle cx={point.x} cy={point.y} r="4" fill={theme.primary} />
                
                {/* Label Text Above Each Point */}
                <Text
                  x={Math.max(10, Math.min(chartWidth - 10, point.x))} // Prevents overflow
                  y={Math.max(15, point.y - 10)} // Keeps labels readable
                  fontSize="10"
                  fill={theme.text}
                  textAnchor="middle"
                >
                  {data[index].toFixed(2)}
                </Text>

              </React.Fragment>
            ))}
          </Svg>
        </View>
      </Card.Content>
    </Card>
  );
};


// Function to generate the SVG path for line chart
// Function to generate the SVG path for line chart
const generatePath = (data, width, height, minY, maxY) => {
  const limitedData = data.slice(-4); // Keep last 4 points

  if (limitedData.length === 0) return '';

  const xStep = width / 4; // Ensure last point fits inside the box
  const scaleY = (val) => height - ((val - minY) / (maxY - minY)) * height;

  let path = `M 0 ${scaleY(limitedData[0])}`;
  limitedData.forEach((y, i) => {
    path += ` L ${(i + 0.5) * xStep} ${scaleY(y)}`; // Adjust to prevent overflow
  });

  return path;
};

const generatePoints = (data, width, height, minY, maxY) => {
  const limitedData = data.slice(-4); // Keep last 4 points

  if (limitedData.length === 0) return [];

  const xStep = width / 4; // Adjust for correct spacing
  const scaleY = (val) => height - ((val - minY) / (maxY - minY)) * height;

  return limitedData.map((y, i) => ({
    x: (i + 0.5) * xStep, // Shift points slightly to fit within box
    y: scaleY(y),
  }));
};

  
  
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 , backgroundColor: "#FFFFFF" },
  header: { textAlign: "center", fontSize: 22, marginBottom: 10 },
  card: { marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 8 },
});

export default Settings;
