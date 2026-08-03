# 🌦️ Weather Web App

A modern, responsive, and user-friendly Weather Web Application built using **HTML, CSS, and JavaScript**. This application provides real-time weather information for any city using a weather API. Users can search for any location and instantly view current weather conditions, temperature, humidity, wind speed, and more.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Project Workflow](#-project-workflow)
- [Responsive Design](#-responsive-design)
- [Future Enhancements](#-future-enhancements)
- [Browser Support](#-browser-support)
- [Performance](#-performance)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

# 📖 Overview

The **Weather Web App** is a lightweight and interactive application that allows users to check live weather information for any city around the world. It communicates with a weather API to fetch real-time weather data and displays it in a clean and attractive interface.

The application is designed using pure HTML, CSS, and JavaScript without any frontend framework, making it beginner-friendly while demonstrating practical API integration and asynchronous JavaScript concepts.

---

# ✨ Features

- 🌍 Search weather by city name
- 🌡️ Real-time temperature
- ☁️ Weather condition
- 💧 Humidity
- 🌬️ Wind Speed
- 📍 Location details
- 🌅 Sunrise & Sunset
- 🌡️ Feels Like Temperature
- 🔄 Dynamic Weather Icons
- 📱 Fully Responsive Design
- ⚡ Fast API Requests
- ❌ Error Handling
- 🔍 Search Validation
- 🌙 Clean Modern UI
- 🎨 Attractive CSS Animations

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling |
| JavaScript (ES6) | Functionality |
| Fetch API | API Requests |
| Weather API | Live Weather Data |

---

# 📂 Project Structure

```
Weather-Web-App/
│
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── icons/
│   ├── images/
│   └── background/
│
├── README.md
└── LICENSE
```

---

# 📷 Screenshots

Add screenshots here after completing the project.

```
assets/screenshots/home.png

assets/screenshots/search.png

assets/screenshots/mobile-view.png
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/weather-web-app.git
```

## Navigate to Project

```bash
cd weather-web-app
```

## Open Project

Simply open:

```
index.html
```

or use **VS Code Live Server**.

---

# ▶️ Usage

1. Open the application.
2. Enter a city name.
3. Click the Search button.
4. Wait for the weather data to load.
5. View the weather details instantly.

---

# 🌐 API Integration

The application uses a weather API to retrieve live weather information.

### Example API Request

```
https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric
```

### Example Response

```json
{
  "name": "London",
  "main": {
    "temp": 25,
    "humidity": 72
  },
  "weather": [
    {
      "description": "Clear Sky"
    }
  ],
  "wind": {
    "speed": 4.6
  }
}
```

---

# ⚙️ Project Workflow

```
User Input

↓

Validate City

↓

API Request

↓

Fetch Weather Data

↓

Parse JSON Response

↓

Update UI

↓

Display Weather Information
```

---

# 📱 Responsive Design

The application is optimized for:

- Desktop
- Laptop
- Tablet
- Mobile Devices

Responsive layouts are created using:

- Flexbox
- CSS Grid
- Media Queries

---

# 🎨 UI Features

- Glassmorphism Design
- Smooth Hover Effects
- Animated Buttons
- Responsive Cards
- Dynamic Weather Icons
- Beautiful Color Palette
- Clean Typography

---

# ⚡ Performance

- Lightweight Project
- Optimized CSS
- Fast API Calls
- Minimal DOM Manipulation
- Efficient JavaScript
- Clean Code Structure

---

# 🔒 Security

- API Input Validation
- Empty Search Prevention
- Error Handling
- Safe Fetch Requests
- Proper Exception Handling
- Invalid City Detection

---

# 📌 Error Handling

The application handles:

- Empty Input
- Invalid City
- API Failure
- Internet Connection Issues
- Server Errors

User-friendly error messages are displayed accordingly.

---

# 🚀 Future Enhancements

- 📍 Current Location Weather
- 🌙 Dark Mode
- ⭐ Favorite Cities
- 🕒 Weather History
- 📅 7-Day Forecast
- ⏰ Hourly Forecast
- 🌎 Multiple Languages
- 🌡️ Unit Conversion (°C / °F)
- 📡 Offline Support
- ☔ Rain Probability
- 🌅 UV Index
- 🌪️ Air Quality Index

---

# 🌍 Browser Support

| Browser | Supported |
|----------|-----------|
| Chrome | ✅ |
| Firefox | ✅ |
| Edge | ✅ |
| Safari | ✅ |
| Opera | ✅ |

---

# 🧪 Testing

The application has been tested for:

- UI Responsiveness
- API Integration
- Search Functionality
- Mobile Compatibility
- Error Handling
- Performance

---

# 🤝 Contributing

Contributions are welcome!

To contribute:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Create a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this project with proper attribution.

---

# 👨‍💻 Author

**Dushyant Saraswat**

### Connect with Me

- GitHub: https://github.com/yourusername
- LinkedIn: https://linkedin.com/in/yourprofile
- Portfolio: https://yourportfolio.com

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the project

🛠️ Contribute to improve it

📢 Share it with others

---

## 💙 Thank You

Thank you for visiting this project! If you have any suggestions or feedback, feel free to open an issue or contribute to make this project even better.

**Happy Coding! 🚀**
