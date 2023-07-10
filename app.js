const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = "c964d18966884a52b38118c37ccd3569";
  const url = `https://api.weatherbit.io/v2.0/current?city=${query}&key=${apiKey}&include=minutely`;

  https.get(url, (response) => {
    console.log(response.statusCode);

    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const weatherData = JSON.parse(data);
        const temp = weatherData.data[0].temp;
        const weatherDescription = weatherData.data[0].weather.description;
        const icon = weatherData.data[0].weather.icon;
        const imageUrl = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
        res.write("<p>The weather is currently " + weatherDescription + "</p>");
        res.write(
          `<h1>The temperature in ${query} is ${temp} degrees Celcius</h1>`
        );
        res.write(`<img src=${imageUrl}>`);
        res.send();
      } catch (error) {
        console.log("Error parsing JSON:", error);
      }
    });
  });
});

app.listen(3000, () => {
  return console.log("server is running on port 3000");
});
