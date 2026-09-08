"use strict";

/*
 * WEATHER BULL
 * Modern weather dashboard
 *
 * API:
 * OpenWeather Current Weather API
 */

const API_KEY = "YOUR_NEW_OPENWEATHER_API_KEY";

const API_URL =
    "https://api.openweathermap.org/data/2.5/weather";


// ======================================
// DOM ELEMENTS
// ======================================

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const locationButton = document.getElementById("locationButton");

const searchButton = document.getElementById("searchButton");

const dashboard = document.getElementById("weatherDashboard");
const emptyState = document.getElementById("emptyState");

const loader = document.getElementById("loader");
const status = document.getElementById("status");

const locationName = document.getElementById("locationName");
const currentDate = document.getElementById("currentDate");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const minTemperature =
    document.getElementById("minTemperature");

const maxTemperature =
    document.getElementById("maxTemperature");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const pressure =
    document.getElementById("pressure");

const visibility =
    document.getElementById("visibility");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");


// ======================================
// WEATHER ICONS
// ======================================

const WEATHER_ICONS = {

    "01d": "☀️",
    "01n": "🌙",

    "02d": "🌤️",
    "02n": "☁️",

    "03d": "☁️",
    "03n": "☁️",

    "04d": "☁️",
    "04n": "☁️",

    "09d": "🌧️",
    "09n": "🌧️",

    "10d": "🌦️",
    "10n": "🌧️",

    "11d": "⛈️",
    "11n": "⛈️",

    "13d": "❄️",
    "13n": "❄️",

    "50d": "🌫️",
    "50n": "🌫️"
};


// ======================================
// INITIALIZATION
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    cityInput.focus();

});


// ======================================
// SEARCH EVENT
// ======================================

searchForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {

        showError("Please enter a city name.");

        cityInput.focus();

        return;
    }

    await getWeatherByCity(city);

});


// ======================================
// CURRENT LOCATION
// ======================================

locationButton.addEventListener("click", () => {

    if (!navigator.geolocation) {

        showError(
            "Geolocation is not supported by your browser."
        );

        return;
    }

    showLoading();

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const {
                latitude,
                longitude
            } = position.coords;

            await getWeatherByCoordinates(
                latitude,
                longitude
            );

        },

        (error) => {

            hideLoading();

            let message =
                "Unable to access your location.";

            if (error.code === error.PERMISSION_DENIED) {

                message =
                    "Location permission was denied.";

            }

            showError(message);

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }

    );

});


// ======================================
// CITY WEATHER
// ======================================

async function getWeatherByCity(city) {

    if (!isApiKeyConfigured()) {
        showError(
            "Add your new OpenWeather API key in script.js."
        );
        return;
    }

    showLoading();

    try {

        const params = new URLSearchParams({
            q: city,
            appid: API_KEY,
            units: "metric"
        });

        const response =
            await fetch(`${API_URL}?${params}`);

        if (!response.ok) {

            throw new Error(
                getApiErrorMessage(response.status)
            );
        }

        const data =
            await response.json();

        renderWeather(data);

    } catch (error) {

        console.error(
            "Weather request failed:",
            error
        );

        showError(
            error.message ||
            "Unable to fetch weather data."
        );

    } finally {

        hideLoading();

    }

}


// ======================================
// COORDINATE WEATHER
// ======================================

async function getWeatherByCoordinates(
    latitude,
    longitude
) {

    if (!isApiKeyConfigured()) {

        hideLoading();

        showError(
            "Add your new OpenWeather API key in script.js."
        );

        return;
    }

    try {

        const params = new URLSearchParams({
            lat: latitude,
            lon: longitude,
            appid: API_KEY,
            units: "metric"
        });

        const response =
            await fetch(`${API_URL}?${params}`);

        if (!response.ok) {

            throw new Error(
                getApiErrorMessage(response.status)
            );
        }

        const data =
            await response.json();

        renderWeather(data);

    } catch (error) {

        console.error(
            "Location weather request failed:",
            error
        );

        showError(
            error.message ||
            "Unable to fetch weather data."
        );

    } finally {

        hideLoading();

    }

}


// ======================================
// RENDER WEATHER
// ======================================

function renderWeather(data) {

    const weather =
        data.weather?.[0];

    const main =
        data.main;

    const wind =
        data.wind;

    const system =
        data.sys;

    if (!weather || !main) {

        showError(
            "Weather data is unavailable."
        );

        return;
    }


    // Location
    locationName.textContent =
        `${data.name}, ${system?.country || ""}`;


    // Date
    currentDate.textContent =
        formatDate(
            data.dt,
            data.timezone
        );


    // Temperature
    temperature.textContent =
        `${Math.round(main.temp)}°`;

    feelsLike.textContent =
        `${Math.round(main.feels_like)}°`;


    // Description
    weatherDescription.textContent =
        weather.description;


    // Icon
    weatherIcon.textContent =
        WEATHER_ICONS[weather.icon] || "🌤️";


    // Min / Max
    minTemperature.textContent =
        `${Math.round(main.temp_min)}°`;

    maxTemperature.textContent =
        `${Math.round(main.temp_max)}°`;


    // Humidity
    humidity.textContent =
        `${main.humidity}%`;


    // Wind
    const speed =
        typeof wind?.speed === "number"
            ? wind.speed.toFixed(1)
            : "--";

    windSpeed.textContent =
        `${speed} m/s`;


    // Pressure
    pressure.textContent =
        `${main.pressure} hPa`;


    // Visibility
    const visibilityKm =
        typeof data.visibility === "number"
            ? data.visibility / 1000
            : null;

    visibility.textContent =
        visibilityKm !== null
            ? `${visibilityKm.toFixed(1)} km`
            : "--";


    // Sunrise / Sunset
    sunrise.textContent =
        formatTime(
            system?.sunrise,
            data.timezone
        );

    sunset.textContent =
        formatTime(
            system?.sunset,
            data.timezone
        );


    // UI state
    dashboard.classList.remove("hidden");

    emptyState.classList.add("hidden");

    clearError();

}


// ======================================
// DATE FORMAT
// ======================================

function formatDate(
    unixSeconds,
    timezoneOffset
) {

    if (!unixSeconds) {
        return "--";
    }

    const date =
        new Date(
            (unixSeconds + timezoneOffset) * 1000
        );

    return new Intl.DateTimeFormat(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC"
        }
    ).format(date);

}


// ======================================
// TIME FORMAT
// ======================================

function formatTime(
    unixSeconds,
    timezoneOffset
) {

    if (!unixSeconds) {
        return "--:--";
    }

    const date =
        new Date(
            (unixSeconds + timezoneOffset) * 1000
        );

    return new Intl.DateTimeFormat(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC"
        }
    ).format(date);

}


// ======================================
// API ERROR HANDLING
// ======================================

function getApiErrorMessage(statusCode) {

    switch (statusCode) {

        case 400:
            return "Invalid weather request.";

        case 401:
            return "Invalid or inactive OpenWeather API key.";

        case 404:
            return "City not found. Try another city.";

        case 429:
            return "Too many requests. Please try again later.";

        case 500:
        case 502:
        case 503:
            return "OpenWeather is temporarily unavailable.";

        default:
            return "Unable to retrieve weather data.";

    }

}


// ======================================
// LOADING
// ======================================

function showLoading() {

    loader.classList.remove("hidden");

    searchButton.disabled = true;

    searchButton.style.opacity = "0.6";

    clearError();

}


function hideLoading() {

    loader.classList.add("hidden");

    searchButton.disabled = false;

    searchButton.style.opacity = "1";

}


// ======================================
// ERROR
// ======================================

function showError(message) {

    status.textContent = message;

}


function clearError() {

    status.textContent = "";

}


// ======================================
// API KEY VALIDATION
// ======================================

function isApiKeyConfigured() {

    return (
        API_KEY &&
        API_KEY !== "YOUR_NEW_OPENWEATHER_API_KEY" &&
        API_KEY.length > 10
    );

}
