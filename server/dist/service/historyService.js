// TODO: Define a City class with name and id properties
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
class City {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        return await fs.readFile('./db/searchHistory.json', 'utf8');
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        return await fs.writeFile('./db/searchHistory.json', JSON.stringify(cities, null, '\t'));
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return await this.read().then((cities) => {
            let parsedCities;
            try {
                parsedCities = [].concat(JSON.parse(cities));
            }
            catch (error) {
                parsedCities = [];
            }
            return parsedCities;
        });
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(city) {
        if (!city) {
            throw new Error('City name is required');
        }
        const newCity = { name: city, id: uuidv4() };
        return await this.getCities().then((cities) => {
            if (cities.find((index) => index.name === city)) {
                return cities;
            }
            return [...cities, newCity];
        })
            .then((updatedcities) => this.write(updatedcities))
            .then(() => newCity);
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        return await this.getCities()
            .then((cities) => cities.filter((city) => city.id !== id))
            .then((filteredcities) => filteredcities);
    }
}
export default new HistoryService();
