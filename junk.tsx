/*
This sucks
const harveyTestHTML1 = (props: PDFExporterProps) =>
    `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      
      <link rel="stylesheet" href="../harveyTestHTML/verycool.css">
      <!-- Inter imports -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    
      <style>
        
  :root {
    --page-height: auto;
    --title-size: 50px;
    --details-size: 26px;
    --separator-border: 4px solid gray;
  }
  
  
  body {
    height: var(--page-height);
    display: flex;
    flex-direction: column;
    font-family: "Inter", Arial;
    padding: 40px 40px 0px 40px;
  }
  
  .header-container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    border-bottom: var(--separator-border);
    padding-bottom: 5px;
  }
  
  .report-title {
    font-weight: 500;
    font-size: var(--title-size);
  }
  
  .date-generated {
    font-size: var(--details-size);
    margin-top: 20px;
  }
  

  
  .details-container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto auto auto;
    row-gap: 10px;
    column-gap: 20px;
    margin-top: 20px;
    font-size: --details-size;
    border-bottom: var(--separator-border);
    padding-bottom: 20px;
    margin-bottom: 110px;
  }
  
  
  
  .maps-container {
    border-radius: 32px;
    border: 3px solid black;
  }
  
  .google-maps-image {
    object-fit: fill;
    width: 100%;
  }
  
  
  .map-details-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: --details-size;
    padding-bottom: 20px;
    border-bottom: var(--separator-border);
    flex: 1;
    margin-top: 50px;
  }
  
  
  .page-number {
    display: flex;
    justify-content: end;
    font-size: --details-size;
    margin-top: 10px;
  }
      </style>
      </head>
    <body>
      <header class="header-container">
        <div>
          <div class="report-title"> ${testData.studentNumber} Report </div>
          <div class="date-generated"> Date Generated: DD/MM/YYYY </div>
        </div>
        <img src="../assets/Ctrl alt innovate logo.png" />
      </header>
  
      <div class="details-container">
        <!--Maps Details-->
        <div class="map-details-container">
          <div> Number of Pins: 21</div>
          <div> Average Speed: 0.5km/h</div>
        </div>
  
        <!--Map Container-->
        <div id="map" style="height: 400px; width: 100%;"></div>
  
        <!--Page number-->
        <div class="page-number"> page 3/3 </div>
      </div>
    </body>
    <script>
      function initMap() {
        console.log("Initializing map...");
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
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
  </html>`;
  
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
  `;*/

/*
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
//<link rel="stylesheet" href="PDFStyles.css">
// /<link rel="stylesheet" href="../harveyTestHTML/verycool.css"> */

/** function harveyTestHTML(props: PDFExporterProps) {
  return `<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <!-- Inter imports -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
  
    <style>
      
:root {
    --page-height: auto;
    --title-size: 50px;
    --details-size: 26px;
    --separator-border: 4px solid gray;
  }
  
  
  body {
    height: var(--page-height);
    display: flex;
    flex-direction: column;
    font-family: "Inter", Arial;
    padding: 40px 40px 0px 40px;
  }
  
  .header-container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    border-bottom: var(--separator-border);
    padding-bottom: 5px;
  }
  
  .report-title {
    font-weight: 500;
    font-size: var(--title-size);
  }
  
  .date-generated {
    font-size: --details-size;
    margin-top: 20px;
  }
  
  
  
  .details-container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto auto auto;
    row-gap: 10px;
    column-gap: 20px;
    margin-top: 20px;
    font-size: --details-size;
    border-bottom: var(--separator-border);
    padding-bottom: 20px;
    margin-bottom: 110px;
  }
  
  
  
  .maps-container {
    border-radius: 32px;
    border: 3px solid black;
  }
  
  .google-maps-image {
    object-fit: fill;
    width: 100%;
  }
  
  
  .map-details-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: --details-size;
    padding-bottom: 20px;
    border-bottom: var(--separator-border);
    flex: 1;
    margin-top: 50px;
  }
  
  
  .page-number {
    display: flex;
    justify-content: end;
    font-size: --details-size;
    margin-top: 10px;
  }
      </style>
      </head>
    <body>
      <header class="header-container">
        <div>
          <div class="report-title"> STXXXXXXXX Report </div>
          <div class="date-generated"> Date Generated: ${todayDate} </div>
        </div>
        <img src="../assets/Ctrl alt innovate logo.png" />
      </header>
  
      <div class="details-container">
          <!--Column 1-->
          <div style="grid-column: 1; grid-row: 1;"> Organisation: </div>
          <div style="grid-column: 1; grid-row: 2;"> Start Time: </div>
          <div style="grid-column: 1; grid-row: 3;"> End Time: </div>
          <div style="grid-column: 1; grid-row: 4;"> Duration: 5 minutes</div>
          <!--Column 2-->
          <div style="grid-column: 2; grid-row: 1;"> ${testData.orgName} </div>
          <div style="grid-column: 2; grid-row: 2;"> ${testData.sessionStartDateTime} </div>
          <div style="grid-column: 2; grid-row: 3;"> ${testData.sessionEndDateTime} </div>
          <div style="grid-column: 2; grid-row: 4;"> HH:MM:ss </div>
          <!--Column 3-->
          <div style="grid-column: 3; grid-row: 1;"> Street Num </div>
          <div style="grid-column: 3; grid-row: 2;"> Suburb </div>
          <div style="grid-column: 3; grid-row: 3;"> Province </div>
          <div style="grid-column: 3; grid-row: 4;"> Postal Code </div>
      </div>
  
      <!--Static map with multiple pins-->
      <img src="${staticMapURL}" style="width: 100%; height: auto;" />
  
      <!--Maps Details-->
      <div class="map-details-container">
        <div> Number of Pins: 2</div>
        <div> Average Speed: 0.5km/h</div>
      </div>
  
      <!--Page number-->
      <div class="page-number"> page 3/3 </div>
    </body>
     
  </html>`;
  }*/
