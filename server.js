const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Weather App Sample Server!</h1>');
    res.send('<h2>Available API calls:</h2>');
    res.send('<h3>/cities - gets weather for cities</h3>');
});

app.get('/cities', (req, res) => {
    async function getWeather() {
        try {
            //Step 1: Get the city
            const city = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=10&language=en&format=json");

            //Step 2: Check the response
            if (!city.ok) {
                throw new fetchError(`Fetching data failed. Code: ${city.status}`)
            }

            //Step 3: Extract JSON
            const data = await city.json();
            console.log(data);
            res.json(data);
        } catch (fetchError) { //Step 4: Log errors encountered
            console.log(fetchError);
        }
    }

    getWeather();
})

const port = process.env.PORT || 3000; // You can use environment variables 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});