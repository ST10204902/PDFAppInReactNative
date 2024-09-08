# PDFApp in React Native

This is a comprehensive guide on how to install and use PDFAppInReactNative, a React Native application for managing and viewing PDF files.

## Installation

To install PDFAppInReactNative, follow these steps:

1. Clone the repository to your local machine:

   ```shell
   git clone https://github.com/ST10204902/PDFAppInReactNative.git
   ```

2. Navigate to the project directory:

   ```shell
   cd PDFAppInReactNative
   ```

3. Install the required dependencies:

   ```shell
   npm install
   ```

4. Start the development server:

   ```shell
   npx expo start
   ```

5. Connect your device or emulator to the development server. You can use the Expo Go app on your mobile device or run the app on an emulator.

6. Once the app is running, you can start using the PDFExporter.

## Obtaining a Google Maps API Key

To use the Google Maps functionality in PDFAppInReactNative, you will need to obtain a Google Maps API key. Follow these steps to get your API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).

2. Create a new project or select an existing project.

3. Enable the Google Maps JavaScript API for your project.

4. Go to the [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials) page.

5. Click on the "Create Credentials" button and select "API key".

6. Copy the generated API key.

7. In this React Native project, open the `PDFExporter.js` file.

8. Locate the line that says `$GOOGLE_MAPS_API_KEY$` and replace it with your API key.

9. Save the file and restart the development server.

Now you have successfully obtained and integrated your Google Maps API key into PDFAppInReactNative. You can now use the Google Maps functionality in the application.
