import * as React from "react";
import { View, StyleSheet, Button, Platform, Text, Alert } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

import { logoBase64 } from "../assets/logoBase64";

const GOOGLE_MAPS_API_KEY = "AIzaSyC1JqHS-ggOWGyUWIC6prK3UfFFrN8MptI";
//test data
const testData: PDFExporterProps = {
  studentNumber: "ST12345678",
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
    { lat: "-33.958679", long: "18.480186", timestamp: "2023-01-01T10:00:00Z" },
    { lat: "-33.957335", long: "18.480464", timestamp: "2023-01-01T10:05:00Z" },
    { lat: "-33.955751", long: "18.481173", timestamp: "2023-01-01T10:10:00Z" },
    { lat: "-33.954986", long: "18.481333", timestamp: "2023-01-01T10:15:00Z" },
    { lat: "-33.954122", long: "18.481795", timestamp: "2023-01-01T10:20:00Z" },
    { lat: "-33.953313", long: "18.482632", timestamp: "2023-01-01T10:25:00Z" },
    { lat: "-33.952547", long: "18.483372", timestamp: "2023-01-01T10:30:00Z" },
    { lat: "-33.951889", long: "18.484037", timestamp: "2023-01-01T10:35:00Z" },
  ],
  numPins: 8,
  avgSpeed: 2.5,
  pageNumber: 1,
};

const generateStaticMapURL = (PinData: Array<Pin>, apiKey: string) => {
  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?";
  const center = `center=${PinData[3].lat},${PinData[3].long}`;
  const zoom = "zoom=15";
  const size = "size=600x400";
  const mapType = "maptype=roadmap";

  //generate the markers parameter for each pin
  const markers = PinData.map(
    (pin) => `markers=color:red%7Clabel:P%7C${pin.lat},${pin.long}`
  ).join("&");

  return `${baseUrl}${center}&${zoom}&${size}&${mapType}&${markers}&key=${apiKey}`;
};

const staticMapURL = generateStaticMapURL(
  testData.PinData,
  GOOGLE_MAPS_API_KEY
);

function harveyTestHTML(props: PDFExporterProps, logoBase64: string): string {
  return `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  
    <style>
      :root {
        --title-size: 36px;
        --details-size: 18px;
        --separator-border: 1px solid #000;
        --light-gray: #f0f0f0;
        --text-gray: #666;
        --bold-font: 500;
        --logo-size: 100px;
      }

      body {
        font-family: 'Inter', sans-serif;
        padding: 20px;
        color: #000;
        background-color: var(--light-gray);
        text-align: left;
      }

      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        border-bottom: var(--separator-border);
      }

      .report-title {
        font-size: var(--title-size);
        font-weight: var(--bold-font);
      }

      .date-generated {
        font-size: var(--details-size);
        color: var(--text-gray);
      }

      /* Grid for details section */
      .details-container {
        display: grid;
        grid-template-columns: 1fr 2fr 2fr;
        grid-template-rows: auto auto auto auto;
        gap: 10px;
        margin-top: 20px;
        padding-bottom: 20px;
        border-bottom: var(--separator-border);
        font-size: var(--details-size);
      }

      .details-container div {
        padding: 5px 0;
      }

      /* Column 1: Descriptors */
      .descriptor {
        font-weight: var(--bold-font);
      }

      /* Column 2: Data */
      .data {
        font-size: var(--details-size);
      }

      /* Column 3: Address details */
      .address {
        font-size: var(--details-size);
      }

      /* Map container styling */
      .maps-container {
        margin-top: 20px;
        border-radius: 16px;
        border: 2px solid #ccc;
        overflow: hidden;
      }

      .google-maps-image {
        object-fit: cover;
        width: 100%;
        height: auto;
        border-radius: 16px;
      }

      /* Map details */
      .map-details-container {
        margin-top: 15px;
        font-size: var(--details-size);
        padding-bottom: 10px;
        color: var(--text-gray);
      }

      /* Footer and page number */
      .footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
        font-size: var(--details-size);
        color: var(--text-gray);
      }

    </style>
  </head>
  <body>
    <header class="header-container">
      <div>
        <div class="report-title"> ${props.studentNumber} Report </div>
        <div class="date-generated"> Date Generated: ${new Date().toLocaleDateString()} </div>
      </div>
      <img src="${logoBase64}" style="width: var(--logo-size);" />
    </header>

    <div class="details-container">
      <!-- Row 1 -->
      <div class="descriptor">Organisation:</div>
      <div class="data">${props.orgName}</div>
      <div class="address">${props.streetNumber}</div>

      <!-- Row 2 -->
      <div class="descriptor">Start Time:</div>
      <div class="data">${props.sessionStartDateTime}</div>
      <div class="address">${props.suburb}</div>

      <!-- Row 3 -->
      <div class="descriptor">End Time:</div>
      <div class="data">${props.sessionEndDateTime}</div>
      <div class="address">${props.province}</div>

      <!-- Row 4 -->
      <div class="descriptor">Duration:</div>
      <div class="data">HH:MM:ss</div>
      <div class="address">${props.postalCode}</div>
    </div>

    <!-- Static map with multiple pins -->
    <div class="maps-container">
      <img src="${generateStaticMapURL(props.PinData, GOOGLE_MAPS_API_KEY)}" class="google-maps-image" />
    </div>

    <!-- Map details -->
    <div class="map-details-container">
      <div>Number of Pins: ${props.numPins}</div>
      <div>Average Speed: ${props.avgSpeed} km/h</div>
    </div>

    <!-- Page number -->
    <div class="footer">
      Page ${props.pageNumber}/3
    </div>
  </body>
</html>`;
}


export default function PDFExporter() {
  const [selectedPrinter, setSelectedPrinter] = React.useState<any>();
  console.log("GOOGLE_MAPS_API_KEY", GOOGLE_MAPS_API_KEY);
  const print = async () => {
    try {
      //generate the html content
      const htmlContent = harveyTestHTML(testData, logoBase64);

      // On iOS/android prints the given html. On web prints the HTML from the current page.
      await Print.printAsync({
        //html: generateHTML(testData),
        html: htmlContent,
        printerUrl: selectedPrinter?.url, // iOS only
      });
    } catch (error) {
      console.error("Failed to print:", error);
      Alert.alert("Error", "Failed to print. Please try again.");
    }
  };

  const printToFile = async () => {
    try {
      // Generate the HTML content using the Base64 logo
      const htmlContent = harveyTestHTML(testData, logoBase64);

      // Print to file
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
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

interface Pin {
  lat: string;
  long: string;
  timestamp: string;
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
