import express from 'express';
import WeatherService from '../../service/weatherService'; // Adjusted path if necessary

const router = express.Router();

router.get('/weather', async (req, res) => {
  try {
    // Extract city parameter from the query string
    const city = req.query.city as string;

    // Validate that the city parameter is provided
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required.' });
    }

    // Fetch weather data for the provided city
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Return the weather data as a JSON response
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);

    // Respond with an appropriate error message
    return res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

export default router;
