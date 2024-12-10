import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: string;
  lon: string;
}

class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: string;
  windSpeed: string;
  humidity: string;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: string, windSpeed: string, humidity: string) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

class WeatherService {
  private baseUrl?: string;
  private API_key?: string;
  private city_name?: string;

  constructor(city_name?: string) {
    this.baseUrl = process.env.API_BASE_URL || "";
    this.API_key = process.env.API_KEY || "";
    this.city_name = city_name || "";
  }

  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);

      // Parse data then send it to be destructured
      const locationData = await response.json();
      return locationData;
    } catch (err) {
      console.log('ERROR:', err);
      return err;
    }
  }

  private destructureLocationData(locationData: any): Coordinates {
    // Create object using the Coordinates Interface
    const locationObj: Coordinates = {
      lat: locationData.lat.toString(),
      lon: locationData.lon.toString(),
    };

    return locationObj;
  }

  private buildGeocodeQuery(): string {
    return `${this.baseUrl}/geo/1.0/direct?q=${this.city_name}&appid=${this.API_key}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.API_key}`;
  }

  private async fetchAndDestructureLocationData() {
    // Fetch the location data
    const newLocationData = await this.fetchLocationData(this.buildGeocodeQuery());
    // Send new data off to be destructured
    return this.destructureLocationData(newLocationData);
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      // Send coordinates to be inserted into the weather Query
      const location = this.buildWeatherQuery(coordinates);
      const response = await fetch(location);
      // Parse the weather data
      return await response.json();
    } catch (err) {
      console.log('ERROR:', err);
      return err;
    }
  }

  private buildForecastArray(weatherData: any[]) {
    // Map out the weather array
    return weatherData.map((weather) => {
      return new Weather(
        weather.city.name,
        weather.dt_text,
        weather.weather.icon,
        weather.weather.description,
        weather.main.temp,
        weather.wind.speed,
        weather.main.humidity
      );
    });
  }

  async getWeatherForCity(city: string) {
    this.city_name = city;
    const destructuredData = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(destructuredData);
    return this.buildForecastArray(weatherData.list); // Assume `list` holds forecast data
  }
}

export default new WeatherService();
