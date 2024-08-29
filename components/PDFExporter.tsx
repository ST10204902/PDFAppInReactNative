import * as React from "react";
import { View, StyleSheet, Button, Platform, Text, Alert } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const testHTML = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;
interface Pin {
  lat: string;
  long: string;
}
//Gmap API:
interface PDFExporterProps {
  studentNumber: string;
  orgName: string;
  sessionStartDateTime: string;
  sessionEndDateTime: string;
  streetNumber: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  viewport: string;
  PinData: Array<Pin>; //latitudes and longitudes
  numPins: number;
  avgSpeed: number;
  pageNumber: number;
}

const generateHTML = (props: PDFExporterProps) => `
  <html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="PDFStyles.css">
</head>
<body style="text-align: center;">
  <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
    Report for Student: ${props.studentNumber}
  </h1>
  <h2>Organisation: ${props.orgName}</h2>
  <p>Session Start: ${props.sessionStartDateTime}</p>
  <p>Session End: ${props.sessionEndDateTime}</p>
  <p>Location: ${props.streetNumber}, ${props.suburb}, ${props.city}, ${
  props.province
}, ${props.postalCode}</p>
  <div id="map" style="width: 90vw; height: 400px;"></div>
  <p>Number of Pins: ${props.numPins}</p>
  <p>Average Speed: ${props.avgSpeed} km/h</p>
  <footer>
    <div class="horizontal-spacer"></div>
    <p>Page <span class="page-number"></span></p>
  </footer>
  <script>
    function initMap() {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: ${props.PinData[0].lat}, lng: ${props.PinData[0].long} }
      });
      const flightPlanCoordinates = ${JSON.stringify(
        props.PinData.map((pin) => ({
          lat: parseFloat(pin.lat),
          lng: parseFloat(pin.long),
        }))
      )};
      const flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      flightPath.setMap(map);
      flightPlanCoordinates.forEach(coord => {
        new google.maps.Marker({
          position: coord,
          map: map
        });
      });
    }
  </script>
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap"></script>
</body>
</html>
`;

export default function PDFExporter() {
  const [selectedPrinter, setSelectedPrinter] = React.useState<any>();
  console.log("GOOGLE_MAPS_API_KEY", GOOGLE_MAPS_API_KEY);
  const print = async () => {
    try {
      // On iOS/android prints the given html. On web prints the HTML from the current page.
      await Print.printAsync({
        html: generateHTML(testData),
        printerUrl: selectedPrinter?.url, // iOS only
      });
    } catch (error) {
      console.error("Failed to print:", error);
      Alert.alert("Error", "Failed to print. Please try again.");
    }
  };

  const printToFile = async () => {
    try {
      // On iOS/android prints the given html. On web prints the HTML from the current page.
      const { uri } = await Print.printToFileAsync({
        html: generateHTML(testData),
      });
      console.log("File has been saved to:", uri);
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      console.error("Failed to print to file:", error);
      Alert.alert("Error", "Failed to print to file. Please try again.");
    }
  };

  const selectPrinter = async () => {
    try {
      const printer = await Print.selectPrinterAsync(); // iOS only
      setSelectedPrinter(printer);
    } catch (error) {
      console.error("Failed to select printer:", error);
      Alert.alert("Error", "Failed to select printer. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Print" onPress={print} />
      <View style={styles.spacer} />
      <Button title="Print to PDF file" onPress={printToFile} />
      {Platform.OS === "ios" && (
        <>
          <View style={styles.spacer} />
          <Button title="Select printer" onPress={selectPrinter} />
          <View style={styles.spacer} />
          {selectedPrinter ? (
            <Text style={styles.printer}>{`Selected printer: ${
              (selectedPrinter as any).name
            }`}</Text>
          ) : undefined}
        </>
      )}
    </View>
  );
}

//test data
const testData: PDFExporterProps = {
  studentNumber: "123456",
  orgName: "Test Organization",
  sessionStartDateTime: "2023-01-01T10:00:00Z",
  sessionEndDateTime: "2023-01-01T12:00:00Z",
  streetNumber: "123",
  suburb: "Test Suburb",
  city: "Test City",
  province: "Test Province",
  postalCode: "12345",
  viewport: "width=device-width, initial-scale=1.0",
  PinData: [
    { lat: "37.7749", long: "-122.4194" },
    { lat: "34.0522", long: "-118.2437" },
  ],
  numPins: 2,
  avgSpeed: 50,
  pageNumber: 1,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    flexDirection: "column",
    padding: 8,
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: "center",
  },
});
