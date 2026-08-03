/* ============================================
   AETHER WEATHER — Application Logic
   Uses Open-Meteo API (free, no API key needed)
   ============================================ */

// --- Weather Code Mapping ---
const WEATHER_CODES = {
    0: { label: 'Clear Sky', icon: '☀️', iconNight: '🌙', bg: 'sunny' },
    1: { label: 'Mainly Clear', icon: '🌤️', iconNight: '🌙', bg: 'sunny' },
    2: { label: 'Partly Cloudy', icon: '⛅', iconNight: '☁️', bg: 'cloudy' },
    3: { label: 'Overcast', icon: '☁️', iconNight: '☁️', bg: 'cloudy' },
    45: { label: 'Foggy', icon: '🌫️', iconNight: '🌫️', bg: 'cloudy' },
    48: { label: 'Rime Fog', icon: '🌫️', iconNight: '🌫️', bg: 'cloudy' },
    51: { label: 'Light Drizzle', icon: '🌦️', iconNight: '🌧️', bg: 'rainy' },
    53: { label: 'Moderate Drizzle', icon: '🌦️', iconNight: '🌧️', bg: 'rainy' },
    55: { label: 'Dense Drizzle', icon: '🌧️', iconNight: '🌧️', bg: 'rainy' },
    56: { label: 'Freezing Drizzle', icon: '🌧️', iconNight: '🌧️', bg: 'rainy' },
    57: { label: 'Freezing Drizzle', icon: '🌧️', iconNight: '🌧️', bg: 'rainy' },
    61: { label: 'Slight Rain', icon: '🌦️', iconNight: '🌧️', bg: 'rainy' },
    63: { label: 'Moderate Rain', icon: '🌧️', iconNight: '🌧️', bg: 'rainy' },
    65: { label: 'Heavy Rain', icon: '🌧️', iconNight: '🌧️', bg: 'rainy' },
    66: { label: 'Freezing Rain', icon: '🌧️', iconNight: '🌧️', bg: 'rainy' },
    67: { label: 'Freezing Rain', icon: '🌧️', iconNight: '🌧️', bg: 'rainy' },
    71: { label: 'Slight Snow', icon: '🌨️', iconNight: '🌨️', bg: 'snowy' },
    73: { label: 'Moderate Snow', icon: '❄️', iconNight: '❄️', bg: 'snowy' },
    75: { label: 'Heavy Snow', icon: '❄️', iconNight: '❄️', bg: 'snowy' },
    77: { label: 'Snow Grains', icon: '🌨️', iconNight: '🌨️', bg: 'snowy' },
    80: { label: 'Slight Showers', icon: '🌦️', iconNight: '🌧️', bg: 'rainy' },
    81: { label: 'Moderate Showers', icon: '🌧️', iconNight: '🌧️', bg: 'rainy' },
    82: { label: 'Violent Showers', icon: '⛈️', iconNight: '⛈️', bg: 'rainy' },
    85: { label: 'Snow Showers', icon: '🌨️', iconNight: '🌨️', bg: 'snowy' },
    86: { label: 'Heavy Snow Showers', icon: '❄️', iconNight: '❄️', bg: 'snowy' },
    95: { label: 'Thunderstorm', icon: '⛈️', iconNight: '⛈️', bg: 'rainy' },
    96: { label: 'Thunderstorm + Hail', icon: '⛈️', iconNight: '⛈️', bg: 'rainy' },
    99: { label: 'Thunderstorm + Hail', icon: '⛈️', iconNight: '⛈️', bg: 'rainy' },
};

// --- DOM References ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
    bgGradient: $('#bgGradient'),
    weatherParticles: $('#weatherParticles'),
    searchInput: $('#searchInput'),
    searchSuggestions: $('#searchSuggestions'),
    locationBtn: $('#locationBtn'),
    welcomeLocationBtn: $('#welcomeLocationBtn'),
    loadingScreen: $('#loadingScreen'),
    welcomeScreen: $('#welcomeScreen'),
    weatherDashboard: $('#weatherDashboard'),
    cityName: $('#cityName'),
    currentDate: $('#currentDate'),
    currentCondition: $('#currentCondition'),
    currentTemp: $('#currentTemp'),
    feelsLike: $('#feelsLike'),
    heroWeatherIcon: $('#heroWeatherIcon'),
    windSpeed: $('#windSpeed'),
    humidity: $('#humidity'),
    uvIndex: $('#uvIndex'),
    visibility: $('#visibility'),
    pressure: $('#pressure'),
    dewpoint: $('#dewpoint'),
    hourlyScroll: $('#hourlyScroll'),
    dailyList: $('#dailyList'),
    sunrise: $('#sunrise'),
    sunset: $('#sunset'),
    sunDot: $('#sunDot'),
    sunArcPath: $('#sunArcPath'),
};

// --- State ---
let searchTimeout = null;
let currentCity = null;

// --- Utilities ---
function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatHour(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

function formatDay(isoString) {
    const date = new Date(isoString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString([], { weekday: 'long' });
}

function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function isNightTime(sunrise, sunset) {
    const now = new Date();
    const sr = new Date(sunrise);
    const ss = new Date(sunset);
    return now < sr || now > ss;
}

function getWeatherInfo(code, night = false) {
    const info = WEATHER_CODES[code] || WEATHER_CODES[0];
    return {
        label: info.label,
        icon: night ? info.iconNight : info.icon,
        bg: info.bg,
    };
}

function getUVLabel(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
}

// --- API Calls ---
async function geocodeSearch(query) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
}

async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: [
            'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
            'weather_code', 'wind_speed_10m', 'wind_direction_10m',
            'surface_pressure', 'uv_index', 'is_day'
        ].join(','),
        hourly: [
            'temperature_2m', 'weather_code', 'is_day'
        ].join(','),
        daily: [
            'weather_code', 'temperature_2m_max', 'temperature_2m_min',
            'sunrise', 'sunset', 'uv_index_max', 'precipitation_probability_max'
        ].join(','),
        timezone: 'auto',
        forecast_days: 7,
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather data fetch failed');
    return res.json();
}

async function reverseGeocode(lat, lon) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(1)}&count=1&language=en&format=json`;
    // Open-Meteo doesn't have a true reverse geocode, so we use the nominatim API
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    try {
        const res = await fetch(nomUrl);
        const data = await res.json();
        return data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Your Location';
    } catch {
        return 'Your Location';
    }
}

// --- Weather Particles ---
function clearParticles() {
    DOM.weatherParticles.innerHTML = '';
}

function createRainParticles() {
    clearParticles();
    for (let i = 0; i < 80; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.height = `${15 + Math.random() * 25}px`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.opacity = 0.3 + Math.random() * 0.4;
        DOM.weatherParticles.appendChild(drop);
    }
}

function createSnowParticles() {
    clearParticles();
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.style.left = `${Math.random() * 100}%`;
        const size = 3 + Math.random() * 5;
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.animationDuration = `${3 + Math.random() * 5}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        flake.style.opacity = 0.4 + Math.random() * 0.4;
        DOM.weatherParticles.appendChild(flake);
    }
}

function setWeatherBackground(bgClass) {
    DOM.bgGradient.className = 'bg-gradient ' + bgClass;
    clearParticles();
    if (bgClass === 'rainy') createRainParticles();
    if (bgClass === 'snowy') createSnowParticles();
}

// --- Sun Arc ---
function updateSunArc(sunriseISO, sunsetISO) {
    const now = new Date();
    const sr = new Date(sunriseISO);
    const ss = new Date(sunsetISO);

    const totalDaylight = ss - sr;
    const elapsed = now - sr;
    let progress = Math.max(0, Math.min(1, elapsed / totalDaylight));

    // Position sun dot along the arc path
    const path = DOM.sunArcPath;
    if (path) {
        const totalLength = path.getTotalLength();
        const point = path.getPointAtLength(progress * totalLength);
        DOM.sunDot.setAttribute('cx', point.x);
        DOM.sunDot.setAttribute('cy', point.y);

        // Draw only the portion of the arc that has elapsed
        path.style.strokeDasharray = totalLength;
        path.style.strokeDashoffset = totalLength * (1 - progress);
    }
}

// --- UI Update ---
function showLoading() {
    DOM.welcomeScreen.classList.add('hidden');
    DOM.weatherDashboard.classList.add('hidden');
    DOM.loadingScreen.classList.add('active');
}

function showDashboard() {
    DOM.loadingScreen.classList.remove('active');
    DOM.welcomeScreen.classList.add('hidden');
    DOM.weatherDashboard.classList.remove('hidden');

    // Retrigger animations
    DOM.weatherDashboard.style.animation = 'none';
    DOM.weatherDashboard.offsetHeight; // Reflow
    DOM.weatherDashboard.style.animation = '';
}

function updateUI(data, cityName) {
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const night = current.is_day === 0;
    const weatherInfo = getWeatherInfo(current.weather_code, night);

    // Hero section
    DOM.cityName.textContent = cityName;
    DOM.currentDate.textContent = new Date().toLocaleDateString([], {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    DOM.currentCondition.textContent = weatherInfo.label;
    DOM.currentTemp.textContent = Math.round(current.temperature_2m);
    DOM.feelsLike.textContent = Math.round(current.apparent_temperature);
    DOM.heroWeatherIcon.textContent = weatherInfo.icon;

    // Stats
    DOM.windSpeed.textContent = `${current.wind_speed_10m} km/h`;
    DOM.humidity.textContent = `${current.relative_humidity_2m}%`;
    DOM.uvIndex.textContent = `${current.uv_index} ${getUVLabel(current.uv_index)}`;

    // Calculate visibility from surface pressure (approximate) - Open-Meteo doesn't give direct visibility in basic params
    // We'll display dew point instead of visibility using a calculation
    const temp = current.temperature_2m;
    const rh = current.relative_humidity_2m;
    const dewpointCalc = temp - ((100 - rh) / 5);
    DOM.dewpoint.textContent = `${Math.round(dewpointCalc)}°C`;

    // For visibility, approximate from weather code
    const visMap = { sunny: '10+ km', cloudy: '8 km', rainy: '4 km', snowy: '2 km' };
    DOM.visibility.textContent = visMap[weatherInfo.bg] || '10+ km';

    DOM.pressure.textContent = `${Math.round(current.surface_pressure)} hPa`;

    // Background
    setWeatherBackground(weatherInfo.bg);

    // Hourly forecast (next 24 hours)
    const nowHour = new Date().getHours();
    const currentHourIndex = hourly.time.findIndex(t => new Date(t).getHours() === nowHour && new Date(t).getDate() === new Date().getDate());
    const startIdx = Math.max(0, currentHourIndex);
    const hourlyItems = [];

    for (let i = startIdx; i < Math.min(startIdx + 24, hourly.time.length); i++) {
        const isNow = i === startIdx;
        const hNight = hourly.is_day[i] === 0;
        const hWeather = getWeatherInfo(hourly.weather_code[i], hNight);

        hourlyItems.push(`
            <div class="hourly-item ${isNow ? 'now' : ''}" id="hourly-${i}">
                <span class="hourly-time">${isNow ? 'Now' : formatHour(hourly.time[i])}</span>
                <span class="hourly-icon">${hWeather.icon}</span>
                <span class="hourly-temp">${Math.round(hourly.temperature_2m[i])}°</span>
            </div>
        `);
    }
    DOM.hourlyScroll.innerHTML = hourlyItems.join('');

    // Daily forecast
    const globalMin = Math.min(...daily.temperature_2m_min);
    const globalMax = Math.max(...daily.temperature_2m_max);
    const tempRange = globalMax - globalMin || 1;

    const dailyItems = daily.time.map((day, i) => {
        const dWeather = getWeatherInfo(daily.weather_code[i]);
        const barLeft = ((daily.temperature_2m_min[i] - globalMin) / tempRange) * 100;
        const barWidth = ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / tempRange) * 100;

        return `
            <div class="daily-item" id="daily-${i}">
                <div class="daily-day">
                    ${formatDay(day)}
                    <span class="daily-date">${formatDate(day)}</span>
                </div>
                <span class="daily-icon">${dWeather.icon}</span>
                <span class="daily-condition">${dWeather.label}</span>
                <div class="daily-temps">
                    <span class="daily-low">${Math.round(daily.temperature_2m_min[i])}°</span>
                    <div class="daily-temp-bar">
                        <div class="daily-temp-fill" style="left:${barLeft}%;width:${barWidth}%"></div>
                    </div>
                    <span class="daily-high">${Math.round(daily.temperature_2m_max[i])}°</span>
                </div>
            </div>
        `;
    });
    DOM.dailyList.innerHTML = dailyItems.join('');

    // Sunrise / Sunset
    DOM.sunrise.textContent = formatTime(daily.sunrise[0]);
    DOM.sunset.textContent = formatTime(daily.sunset[0]);
    updateSunArc(daily.sunrise[0], daily.sunset[0]);

    showDashboard();
}

// --- Load Weather ---
async function loadWeather(lat, lon, name) {
    showLoading();
    try {
        const data = await fetchWeather(lat, lon);
        if (!name) {
            name = await reverseGeocode(lat, lon);
        }
        currentCity = { lat, lon, name };
        updateUI(data, name);

        // Save last search
        localStorage.setItem('aether_last', JSON.stringify({ lat, lon, name }));
    } catch (err) {
        console.error('Failed to load weather:', err);
        DOM.loadingScreen.classList.remove('active');
        DOM.welcomeScreen.classList.remove('hidden');
        alert('Failed to fetch weather data. Please try again.');
    }
}

// --- Search ---
function renderSuggestions(results) {
    if (!results.length) {
        DOM.searchSuggestions.classList.remove('active');
        return;
    }

    DOM.searchSuggestions.innerHTML = results.map((r, i) => `
        <div class="suggestion-item" data-idx="${i}" id="suggestion-${i}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${r.name}${r.admin1 ? ', ' + r.admin1 : ''}</span>
            <span class="suggestion-country">${r.country || ''}</span>
        </div>
    `).join('');

    DOM.searchSuggestions.classList.add('active');

    // Attach click handlers
    DOM.searchSuggestions.querySelectorAll('.suggestion-item').forEach((el) => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.dataset.idx);
            const selected = results[idx];
            DOM.searchInput.value = selected.name;
            DOM.searchSuggestions.classList.remove('active');
            loadWeather(selected.latitude, selected.longitude, selected.name);
        });
    });
}

DOM.searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(searchTimeout);

    if (query.length < 2) {
        DOM.searchSuggestions.classList.remove('active');
        return;
    }

    searchTimeout = setTimeout(async () => {
        try {
            const results = await geocodeSearch(query);
            renderSuggestions(results);
        } catch (err) {
            console.error('Search failed:', err);
        }
    }, 300);
});

DOM.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        DOM.searchSuggestions.classList.remove('active');
    }
    if (e.key === 'Enter') {
        const firstItem = DOM.searchSuggestions.querySelector('.suggestion-item');
        if (firstItem) firstItem.click();
    }
});

// Close suggestions on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        DOM.searchSuggestions.classList.remove('active');
    }
});

// --- Geolocation ---
function useGeolocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            loadWeather(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
            console.error('Geolocation error:', err);
            DOM.loadingScreen.classList.remove('active');
            DOM.welcomeScreen.classList.remove('hidden');
            alert('Unable to get your location. Please search for a city instead.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

DOM.locationBtn.addEventListener('click', useGeolocation);
DOM.welcomeLocationBtn.addEventListener('click', useGeolocation);

// --- Init ---
(function init() {
    // Check for saved last location
    const saved = localStorage.getItem('aether_last');
    if (saved) {
        try {
            const { lat, lon, name } = JSON.parse(saved);
            loadWeather(lat, lon, name);
        } catch {
            // Show welcome screen
        }
    }
})();
