## Map Render app
This was implemented as part of an assignment from the SnapTrude team.
Deployed in Vercel - https://map-render-client.vercel.app/

## Requirements
Create a ReactJS app (MERN stack) to get the user to choose a location on a map (use Google Maps or Mapbox), display the region visible in the map and then on the click of a button, capture the visible region in the map as an image and apply it as a material (texture) to a 3D cuboid using BabylonJs.

## Features 
- Authentication/Session management
- Capture Images using Google maps API
- Visualize them as a cuboid
- Visit all the captured images
- Get the top 3 frequently captured images

## Pages
- Home Screen: The root path ("/") brings the user to this page. The user is greeted with the app intro.
- Login Screen: Page for existing users to login
- Register Screen: New users can register themselves. There is a restriction on the password field to be atleast 2 characters long. The username has to be unique.
- Your Captures Screen: A grid of user captures along with the latitude and longitude information for each capture. Users can click on these images to view their 3d cuboid model.
- Top 3 Captures screen: The 3 most frequently captured images are shown in this page. The images are filtered for the most frequently captured (latitude, longitude) pair.
- Capture map Screen: Users can choose a location from the search box or use the mouse to drag and decide on a location. When the 'Capture Region' is pressed, the (latitude, longitude) is rounded by to its near integer (to fecth the top3 captures) and is saved as an image url. The user is then redirected to the 3D render screen.
- 3D Render: Image captured in the previous screen is rendered here as a 3D cuboid with sufficient lighting and flexibility in movement of camera.

## API
- /api/users/register - POST - Register User and return a JWT token for session management
- /api/users/login - POST - Login User and return a JWT token for session management. The token is saved in the client side local storage.
- /api/captures - GET - Fetch the user's captures
- /api/captures/upload - POST - Upload a captured image
- /api/captures/top3 - GET - Top 3 frequently captured images
- /api/captures/:id - GET - Image by id (Not used in the application)
- / - GET - Mock API to test the server

## Middlewares Implemented
- authenticateToken - Middleware to check for the JWT from the request headers.

## MongoDB Database
- User Model - Username and Password
- Capture Model - User ID, Latitude, Longitude, Zoom and Image URL

## Platform
- Frontend - ReactJS, BabylonJS, TailwindCSS
- Backend - NodeJS, Express
- Database - MongoDB
- Deploy - Vercel


