document.addEventListener('DOMContentLoaded', () => {
    // Load initial animation
    loadAnimation('default');

    // Function to fetch weather data based on user input location
    function fetchWeatherData(location) {
        const apiKey = '6e2344081a97175dfa788e51624b7da3'; // Replace with your OpenWeatherMap API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Weather data:', data); // Debugging information
                const temperatureCelsius = data.main.temp;
                const weatherDescription = data.weather[0].description.toLowerCase();
                
                // Update input temperature field with Celsius value
                document.getElementById('inputTemperature').value = temperatureCelsius;
                document.getElementById('inputTemperature').readOnly = false; // Allow editing

                // Set input unit to Celsius
                document.getElementById('inputUnit').value = 'C';

                // Update weather symbol and predict weather
                updateWeatherSymbol(weatherDescription);
                predictWeather(temperatureCelsius, weatherDescription);

                // Convert temperature to other units
                convertTemperature();
            })
            .catch(error => {
                alert("Unable to fetch weather data. Please enter the temperature manually.");
                console.error("Error fetching weather data:", error); // Debugging information
                document.getElementById('inputTemperature').readOnly = false;
                document.getElementById('inputTemperature').placeholder = "Enter temperature (°C)";
            });
    }

    // Function to handle form submission
    document.getElementById('locationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const location = document.getElementById('locationInput').value.trim();
        if (location) {
            fetchWeatherData(location);
        } else {
            alert("Please enter a location.");
        }
    });

    // Function to predict weather based on temperature and weather description
    function predictWeather(temperature, weatherDescription) {
        let predictedWeather;
        if (temperature > 25) {
            predictedWeather = 'sunny';
        } else if (weatherDescription.includes('rain') || weatherDescription.includes('drizzle')) {
            predictedWeather = 'rainy';
        } else {
            predictedWeather = 'cloudy';
        }
        loadAnimation(predictedWeather); // Load animation based on predicted weather
    }

    // Function to convert temperature
    function convertTemperature() {
        const inputTemperature = parseFloat(document.getElementById('inputTemperature').value);
        const inputUnit = document.getElementById('inputUnit').value;
        const outputUnit = document.getElementById('outputUnit').value;

        let celsiusTemperature;

        // Convert input temperature to Celsius
        switch (inputUnit) {
            case 'C':
                celsiusTemperature = inputTemperature;
                break;
            case 'F':
                celsiusTemperature = (inputTemperature - 32) * 5/9;
                break;
            case 'K':
                celsiusTemperature = inputTemperature - 273.15;
                break;
            case 'R':
                celsiusTemperature = (inputTemperature - 491.67) * 5/9;
                break;
        }

        let outputTemperature;

        // Convert Celsius to output unit
        switch (outputUnit) {
            case 'C':
                outputTemperature = celsiusTemperature;
                break;
            case 'F':
                outputTemperature = (celsiusTemperature * 9/5) + 32;
                break;
            case 'K':
                outputTemperature = celsiusTemperature + 273.15;
                break;
            case 'R':
                outputTemperature = (celsiusTemperature + 273.15) * 9/5;
                break;
        }

        document.getElementById('outputTemperature').value = outputTemperature.toFixed(2);
    }

    // Function to update weather symbol based on fetched weather description
    function updateWeatherSymbol(weatherDescription) {
        const weatherSymbol = document.getElementById('weatherSymbol');

        // Update weather symbol text
        weatherSymbol.textContent = weatherDescription;
    }

    // Function to load animation based on predicted weather
    function loadAnimation(weather) {
        const animationContainer = document.getElementById('animationContainer');
        animationContainer.innerHTML = ''; // Clear previous animation

        // Display weather condition text
        let text = '';
        switch (weather) {
            case 'sunny':
                text = 'Sunny ☀️';
                break;
            case 'rainy':
                text = 'Rainy 🌧️';
                break;
            case 'cloudy':
                text = 'Cloudy ☁️';
                break;
            default:
                text = 'Unknown Weather';
                break;
        }

        animationContainer.textContent = text;
    }
});
