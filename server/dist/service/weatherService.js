import dotenv from 'dotenv';
dotenv.config();
// Class for Weather object
class Weather {
    constructor(city, date, icon, iconDescription, tempF, windSpeed, humidity) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}
// Complete WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
        this.apiKey = process.env.API_KEY || '7e148e9a49df47a31452fd063238004c';
        this.city = '';
    }
    // Fetch location data from geocoding API
    async fetchLocationData(query) {
        const response = await fetch(query);
        const data = await response.json();
        return data;
    }
    destructureLocationData(locationData) {
        return {
            lat: locationData[0].lat,
            lon: locationData[0].lon
        };
    }
    buildGeocodeQuery() {
        return `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    }
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/data/2.5/forecast?units=imperial&lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    }
    async fetchAndDestructureLocationData() {
        const url = this.buildGeocodeQuery();
        console.log(url);
        const locationData = await this.fetchLocationData(url);
        console.log(locationData);
        return this.destructureLocationData(locationData);
    }
    async fetchWeatherData(coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    parseCurrentWeather(response) {
        const prefix = response.list[0];
        return new Weather(this.city, prefix.dt_txt, prefix.weather.icon, prefix.weather.description, prefix.main.temp, prefix.wind.speed, prefix.main.humidity);
    }
    buildForecastArray(currentWeather, weatherData) {
        const forecast = [];
        weatherData.forEach((value, index) => {
            if (index === 0) {
                forecast.push(currentWeather);
            }
            else {
                const weatherInstance = new Weather(this.city, value.dt_txt, value.weather.icon, value.weather.description, value.main.temp, value.wind.speed, value.main.humidity);
                forecast.push(weatherInstance);
            }
        });
        return forecast;
    }
    async getWeatherForCity(city) {
        this.city = city;
        let coordinates = await this.fetchAndDestructureLocationData();
        console.log(`codrinates`, coordinates);
        let weatherData = await this.fetchWeatherData(coordinates);
        let currentWeather = this.parseCurrentWeather(weatherData);
        let forecast = this.buildForecastArray(currentWeather, weatherData.list);
        return forecast;
    }
}
export default new WeatherService();
