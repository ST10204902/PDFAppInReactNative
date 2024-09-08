// Code written by Nicholas Meyer / ST10204902
// Code for generating a PDF report with location data and static maps using Expo Print
// and Google Maps Static Maps API. The report includes multiple sessions with location
// logs, organisation details, and a static map showing the location pins.

// The PDF report is generated using HTML content with CSS styling to format the report.
// The report includes a header with the student number, date generated, and logo image.
// Each session is displayed on a separate page with organisation details, session times,
// a static map showing the location logs, and additional details such as pin count and
// average speed between pins.

// The Google Maps Static Maps API is used to generate the static map images with markers
// for each location log. The map zoom level is dynamically calculated based on the spread
// of location data to ensure all pins are visible on the map.

// Imports for React, Expo Print, Expo Sharing, and StyleSheet
import * as React from "react";
import { View, StyleSheet, Button, Platform, Text, Alert } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

// Base64 encoded logo image for the PDF report
import { logoBase64 } from "../assets/logoBase64";

//This key has been rolled and is no longer functional
//It will be implemente via GitHub secrets in the future
const GOOGLE_MAPS_API_KEY =
  "REPLACE_WITH_YOUR_API_KEY -> CHECK README TO GET ONE";

// Sample data for the PDF report
const testData: PDFExporterProps = {
  studentNumber: "ST12345678",
  sessions: [
    {
      sessionLog_id: "session1",
      orgID: "org123",
      sessionStartTime: "2023-01-01T10:00:00Z",
      sessionEndTime: "2023-01-01T12:00:00Z",
      locationLogs: [
        {
          timestamp: "2023-01-01T10:05:00Z",
          latitude: "-33.958679",
          longitude: "18.480186",
        },
        {
          timestamp: "2023-01-01T10:10:00Z",
          latitude: "-33.957335",
          longitude: "18.480464",
        },
        {
          timestamp: "2023-01-01T10:15:00Z",
          latitude: "-33.955751",
          longitude: "18.481173",
        },
        {
          timestamp: "2023-01-01T10:20:00Z",
          latitude: "-33.954986",
          longitude: "18.481333",
        },
      ],
    },
    {
      sessionLog_id: "session2",
      orgID: "org123",
      sessionStartTime: "2023-01-02T11:00:00Z",
      sessionEndTime: "2023-01-02T12:30:00Z",
      locationLogs: [
        {
          timestamp: "2023-01-02T11:10:00Z",
          latitude: "-33.955751",
          longitude: "18.481173",
        },
        {
          timestamp: "2023-01-02T11:15:00Z",
          latitude: "-33.954986",
          longitude: "18.481333",
        },
        {
          timestamp: "2023-01-02T11:20:00Z",
          latitude: "-33.954122",
          longitude: "18.481795",
        },
        {
          timestamp: "2023-01-02T11:25:00Z",
          latitude: "-33.953313",
          longitude: "18.482632",
        },
      ],
    },
    // Additional sessions (up to 4)...
  ],
  organisation: {
    org_id: "org123",
    orgName: "Test Organization",
    orgAddress: {
      streetAddress: "123 Test St",
      suburb: "Test Suburb",
      city: "Test City",
      province: "Test Province",
      postalCode: "12345",
    },
    orgLatitude: "-33.958679",
    orgLongitude: "18.480186",
  },
};

// Calculate the zoom level for the static map based on the location data spread
const calculateZoomLevel = (PinData: Array<LocationLog>) => {
  const latitudes = PinData.map((pin) => parseFloat(pin.latitude));
  const longitudes = PinData.map((pin) => parseFloat(pin.longitude));

  const maxLat = Math.max(...latitudes);
  const minLat = Math.min(...latitudes);
  const maxLng = Math.max(...longitudes);
  const minLng = Math.min(...longitudes);

  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;

  const largestDiff = Math.max(latDiff, lngDiff);

  // Approximate zoom level based on the difference in coordinates
  if (largestDiff > 1.0) {
    return 10; // Zoomed out for larger area
  } else if (largestDiff > 0.5) {
    return 12;
  } else if (largestDiff > 0.1) {
    return 14;
  } else {
    return 16; // Zoomed in for smaller area
  }
};

// Generate the static map URL using the Google Maps Static Maps API
const generateStaticMapURL = (
  PinData: Array<LocationLog>,
  apiKey: string
): string => {
  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?";

  // Calculate the center of the map based on the average latitude and longitude
  const avgLat =
    PinData.reduce((sum, pin) => sum + parseFloat(pin.latitude), 0) /
    PinData.length;
  const avgLng =
    PinData.reduce((sum, pin) => sum + parseFloat(pin.longitude), 0) /
    PinData.length;
  const center = `center=${avgLat},${avgLng}`;

  // Dynamically calculate zoom level based on location data spread
  const zoom = `zoom=${calculateZoomLevel(PinData)}`;
  const size = "size=600x400";
  const mapType = "maptype=roadmap";

  // Generate polyline path to connect the pins
  const path = `path=color:0x0000ff|weight:2|${PinData.map(
    (pin) => `${pin.latitude},${pin.longitude}`
  ).join("|")}`;

  // Generate the markers parameter for each pin with labels showing the count
  const markers = PinData.map(
    (pin, index) =>
      `markers=color:red%7Clabel:${index + 1}%7C${pin.latitude},${
        pin.longitude
      }`
  ).join("&");

  return `${baseUrl}${center}&${zoom}&${size}&${mapType}&${path}&${markers}&key=${apiKey}`;
};

// Calculate the distance between two points using the Haversine formula
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
};

// Calculate the average speed between location logs in kilometers per hour
const calculateAverageSpeed = (locationLogs: Array<LocationLog>): number => {
  if (locationLogs.length < 2) return 0;

  let totalDistance = 0; // in kilometers
  let totalTime = 0; // in hours

  for (let i = 1; i < locationLogs.length; i++) {
    const prevLog = locationLogs[i - 1];
    const currLog = locationLogs[i];

    // Calculate distance between the two points
    const distance = haversineDistance(
      parseFloat(prevLog.latitude),
      parseFloat(prevLog.longitude),
      parseFloat(currLog.latitude),
      parseFloat(currLog.longitude)
    );
    totalDistance += distance;

    // Calculate time difference in hours
    const timeDiffMs =
      new Date(currLog.timestamp).getTime() -
      new Date(prevLog.timestamp).getTime();
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
    totalTime += timeDiffHours;
  }

  // Calculate average speed (distance/time)
  const averageSpeed = totalTime > 0 ? totalDistance / totalTime : 0;
  return Math.round(averageSpeed * 100) / 100; // Return speed rounded to 2 decimal places
};

// Generate the HTML content for the PDF report
function testHTML(props: PDFExporterProps, logoBase64: string): string {
  let htmlContent = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  
      <style>
        @page {
          size: A4;
          margin: 20mm;
          @bottom-right {
            content: "Page " counter(page) " of " counter(pages);
            font-size: 12px;
            color: #666;
          }
        }

        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 10mm;
          background-color: #f0f0f0;
          text-align: left;
          position: relative;
          counter-increment: page;
        }

        /* Header */
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #000;
          margin-bottom: 20px;
        }

        .report-title {
          font-size: 32px;
          font-weight: 500;
        }

        .date-generated {
          font-size: 16px;
          color: #666;
        }

        /* Organisation Details */
        .details-container {
          display: grid;
          grid-template-columns: 1fr 2fr 2fr;
          gap: 10px;
          margin-top: 20px;
          padding-bottom: 20px;
          margin-left: 20px;
          border-bottom: 1px solid #000;
          font-size: 16px;
        }

        .details-container div {
          padding: 5px 0;
        }

        .descriptor {
          font-weight: 500;
        }

        /* Map container with square aspect ratio */
        .maps-container {
          margin-top: 20px;
          border-radius: 16px;
          border: 2px solid #ccc;
          overflow: hidden;
          height: 400px; /* More square-like map */
          width: 100%;
          margin-bottom: 20px;
        }

        .google-maps-image {
          width: 100%;
          height: 100%; /* Adjust height to make the map more square */
          object-fit: cover;
        }

        /* Speed and Pin Count below the map */
        .map-details-container {
          font-size: 16px;
          color: #666;
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
        }

        /* Page break to ensure each session starts on a new page */
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <header class="header-container">
        <div>
          <div class="report-title"> ${props.studentNumber} Report </div>
          <div class="date-generated"> Date Generated: ${new Date().toLocaleDateString()} </div>
        </div>
        <img src="${logoBase64}" class="logo" />
      </header>
  `;

  // Iterate over the sessions and create a new page for each one (up to 4)
  props.sessions.slice(0, 4).forEach((session, index) => {
    const numPins = session.locationLogs.length;
    const avgSpeed = calculateAverageSpeed(session.locationLogs);

    htmlContent += `
      <div class="details-container">
        <div class="descriptor">Organisation:</div>
        <div class="data">${props.organisation.orgName}</div>
        <div class="address">${
          props.organisation.orgAddress.streetAddress
        }</div>

        <div class="descriptor">Start Time:</div>
        <div class="data">${session.sessionStartTime}</div>
        <div class="address">${props.organisation.orgAddress.suburb}</div>

        <div class="descriptor">End Time:</div>
        <div class="data">${session.sessionEndTime}</div>
        <div class="address">${props.organisation.orgAddress.city}</div>

        <div class="descriptor">Duration:</div>
        <div class="data">Duration Placeholder</div>
        <div class="address">${props.organisation.orgAddress.postalCode}</div>
      </div>

      <div class="maps-container">
        <img src="${generateStaticMapURL(
          session.locationLogs,
          GOOGLE_MAPS_API_KEY
        )}" class="google-maps-image" />
      </div>

      <div class="map-details-container">
        <div>Number of Pins: ${numPins}</div>
        <div>Average Speed: ${avgSpeed} km/h</div>
      </div>

      <div class="page-break"></div>
    `;
  });

  htmlContent += `</body></html>`;

  return htmlContent;
}

// Main component for the PDF Exporter
export default function PDFExporter() {
  const [selectedPrinter, setSelectedPrinter] = React.useState<any>();
  console.log("GOOGLE_MAPS_API_KEY", GOOGLE_MAPS_API_KEY);
  const print = async () => {
    try {
      //generate the html content
      const htmlContent = testHTML(testData, logoBase64);

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
      const htmlContent = testHTML(testData, logoBase64);

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

// Types and helper functions for generating the PDF content
interface LocationLog {
  timestamp: string;
  latitude: string;
  longitude: string;
}

interface SessionLog {
  sessionLog_id: string;
  orgID: string;
  sessionStartTime: string;
  sessionEndTime: string;
  locationLogs: Array<LocationLog>;
}

interface OrganisationAddress {
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
}

interface Organisation {
  org_id: string;
  orgName: string;
  orgAddress: OrganisationAddress;
  orgLatitude: string;
  orgLongitude: string;
}

interface PDFExporterProps {
  studentNumber: string;
  sessions: Array<SessionLog>;
  organisation: Organisation;
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
