import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    // TODO: GET weather data from city name
    // TODO: save city to search history
    try {
        const cityName = req.body.cityName;
        console.log(cityName);
        const weatherData = await WeatherService.getWeatherForCity(cityName);
        console.log(weatherData, cityName);
        await HistoryService.addCity(cityName);
        res.status(200).json(weatherData);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});
// TODO: GET search history
router.get('/history', async (_req, res) => {
    try {
        const history = await HistoryService.getCities();
        res.status(200).json(history);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await HistoryService.removeCity(id);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});
export default router;
