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
const MAX_VISIBLE_POINTS = 10;

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
  const chartWidth = screenWidth * 0.9;
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
        <View style={{ height: chartHeight, width: chartWidth }}>
          <Svg height={chartHeight} width={chartWidth} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Line Path */}
            <Path d={pathData} stroke={theme.primary} strokeWidth="2" fill="none" />

            {/* Dots & Labels */}
            {points.map((point, index) => (
              <React.Fragment key={index}>
                {/* Dot at Data Point */}
                <Circle cx={point.x} cy={point.y} r="4" fill={theme.primary} />
                
                {/* Label Text Above Each Point */}
                <Text
                  x={point.x}
                  y={point.y - 10} // Position slightly above the point
                  fontSize="12"
                  fill={theme.text}
                  textAnchor="middle"
                >
                  {data[index].toFixed(2)} {/* Display data value */}
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
    if (data.length === 0) return '';
  
    const xStep = width / (data.length - 1 || 1);
    const scaleY = (val) => height - ((val - minY) / (maxY - minY)) * height;
  
    let path = `M 0 ${scaleY(data[0])}`;
    data.forEach((y, i) => {
      path += ` L ${i * xStep} ${scaleY(y)}`;
    });
  
    return path;
  };
  
  // Function to generate an array of point positions for dots
  const generatePoints = (data, width, height, minY, maxY) => {
    if (data.length === 0) return [];
  
    const xStep = width / (data.length - 1 || 1);
    const scaleY = (val) => height - ((val - minY) / (maxY - minY)) * height;
  
    return data.map((y, i) => ({
      x: i * xStep,
      y: scaleY(y),
    }));
  };
  
  
  
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { textAlign: "center", fontSize: 22, marginBottom: 10 },
  card: { marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 8 },
});

export default Settings;
