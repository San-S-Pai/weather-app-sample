//IMPORTS
const express = require('express');

//DEFINITIONS
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Weather App Sample Server!</h1>\n<h2>Available API calls:</h2>\n<h3>/getDefaultCities - gets the Default Cities</h3>\n<h4>/getDefCityWeather - gets the weather report for the default cities</h4>');
});

let cityList = new Array();
app.get('/getDefaultCities', (req, res) => {
    // We define the Cities and their IDs here, as these are hardcoded.
    const cities = ["Berlin", "New York", "Beijing", "Tokyo"];
    const ids = [2950159, 5128581, 1816670, 1850147]; // Respectively: Berlin (Germany), New York (USA), Beijing (China), Tokyo (Japan)

    async function getDefaultCities() {
        for (let i = 0; i < 4; i++) {
            try {
                //Step 1: Get the city
                const city = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cities[i]}&count=10&language=en&format=json`);

                //Step 2: Check the response
                if (!city.ok) {
                    throw new fetchError(`Fetching data failed. Code: ${city.status}`)
                }

                //Step 3: Extract JSON
                const data = await city.json();

                //Step 4: check if the ID of the city desired is in ids
                for (let i = 0; i < data.results.length; i++) {
                    if (data.results[i].id) {
                        cityList.push([data.results[i].latitude, data.results[i].longitude]);
                        break;
                    }
                }

                console.log("Data grabbed");
            } catch (fetchError) { //Finally, Log errors encountered
                console.log(fetchError);
            }
        }

        res.send(cityList);
        console.log(cityList);
        return cityList;
    }

    getDefaultCities();
});

class CityCoords {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
};

app.get('/getDefCityWeather', (req, res) => {

    async function getDefCityWeather() {
        try {
            for (let i = 0; i < 4; i++) {
                //Step 1: Construct class
                var temp = new CityCoords(cityList[i][0], cityList[i][1]);

                //Step 2: Set latitude and longitude
                var lat = temp.latitude;
                var long = temp.longitude;

                //Step 3: Fetch weather according to the API format
                const wthr = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min`);

                //Step 4: Check response
                if (!wthr.ok) {
                    throw new fetchError(`Fetching weather failed. Code: ${city.status}`)
                };

                //Step 5: Find the json body
                const wthrJson = await wthr.json();

                //Step 6: Write the response
                //console.log(wthrJson); DEBUG check
                res.write(wthrJson);

                //Step 7: Log every time weather is fetched
                console.log("Weather logged");
            }
        } catch (fetchError) {
            console.log(fetchError);
        }
    }

    getDefCityWeather();
});

const port = process.env.PORT || 3000; // You can use environment variables 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});