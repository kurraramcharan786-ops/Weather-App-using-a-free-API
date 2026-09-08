# Weather App 🌤️

A modern, responsive and professional weather dashboard built using:

- HTML5
- CSS3
- Vanilla JavaScript
- OpenWeather API

## Features

- Search weather by city
- Current location weather
- Current temperature
- Feels-like temperature
- Weather condition
- Humidity
- Wind speed
- Atmospheric pressure
- Visibility
- Sunrise
- Sunset
- Minimum temperature
- Maximum temperature
- Responsive design
- 3D glassmorphism UI
- Animated background
- Loading state
- Error handling

## Project Structure

weather-bull/
│
├── index.html
├── styles.css
├── script.js
└── README.md

## Setup

### 1. Get an OpenWeather API key

Create an OpenWeather account and generate an API key.

### 2. Add your API key

Open:

script.js

Find:

const API_KEY = "YOUR_NEW_OPENWEATHER_API_KEY";

Replace it with your new API key.

Example:

const API_KEY = "YOUR_NEW_OPENWEATHER_API_KEY";

Do not publish your API key in a public GitHub repository.

### 3. Run the website

You can open:

index.html

directly in a browser.

For development, using VS Code with Live Server is recommended.

## API

Weather data is provided by OpenWeather.

Current Weather API endpoint:

https://api.openweathermap.org/data/2.5/weather

The application requests metric units so temperatures are returned in Celsius.

## Browser Location

The "My Location" button uses the browser's Geolocation API.

The browser may ask the user for permission to access their location.

## Important Security Note

A browser-only application exposes the API key to visitors because requests are made from JavaScript.

For a production application, use a backend/serverless function to keep the API key private.

## License

Created for learning and personal projects.
