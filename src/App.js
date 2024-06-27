import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState({});
  const [date, setDate] = useState("");
  const [chartData, setChartData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "09cfbe33ba8641e1981113826242706";

  const fahrenheitToCelsius = (tempF) => {
    return ((tempF - 32) * 5) / 9;
  };

  const searchWeather = (selectedDate) => {
    setError("");
    setLoading(true);
    const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=lagos&dt=${selectedDate}`;
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch weather data. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      setLoading(true);
      const today = new Date();
      const dates = [];
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }

      try {
        const promises = dates.map((date) =>
          axios.get(
            `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=lagos&dt=${date}`
          )
        );

        const responses = await Promise.all(promises);
        const temperatures = responses.map((response) =>
          fahrenheitToCelsius(
            response.data.forecast.forecastday[0].day.avgtemp_f
          )
        );

        setChartData({
          labels: dates.reverse(),
          datasets: [
            {
              label: "Average Temperature (°C)",
              data: temperatures.reverse(),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch 14-day weather data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

  useEffect(() => {
    if (date) {
      searchWeather(date);
    }
  }, [date]);

  return (
    <div className="app">
      <div className="search">
        <h2 style={{ padding: "20px 20px" }}>Welcome to Lagos State</h2>
        <div className="location">
          <p>{data.location ? data.location.localtime : null}</p>
        </div>
        <input
          value={date}
          onChange={(event) => setDate(event.target.value)}
          type="date"
          placeholder="Select Date"
        />
      </div>
      {error && <div className="error">{error}</div>}
      {loading && (
        <div className="container">
          <h2>Loading...</h2>
        </div>
      )}
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.location ? data.location.name : null}</p>
          </div>
          <div className="location">
            {data.forecast ? (
              <h3>{data.forecast.forecastday[0].date}</h3>
            ) : null}
          </div>
          <div className="temp">
            {data.forecast ? (
              <h1>
                {fahrenheitToCelsius(
                  data.forecast.forecastday[0].day.avgtemp_f
                ).toFixed(1)}
                °C
              </h1>
            ) : null}
          </div>
          <div className="description">
            {data.forecast ? (
              <p>{data.forecast.forecastday[0].day.condition.text}</p>
            ) : null}
          </div>
        </div>

        {data.location && data.forecast && (
          <div className="bottom">
            <div className="feels">
              {data.forecast.forecastday[0].day.feelslike_f ? (
                <p className="bold">
                  {fahrenheitToCelsius(
                    data.forecast.forecastday[0].day.feelslike_f
                  ).toFixed(1)}
                  °C
                </p>
              ) : null}
              <p>Report for the Day</p>
            </div>
            <div className="humidity">
              <p className="bold">
                {data.forecast.forecastday[0].day.avghumidity}%
              </p>
              <p>Humidity</p>
            </div>
            <div className="wind">
              <p className="bold">
                {data.forecast.forecastday[0].day.maxwind_mph.toFixed()} MPH
              </p>
              <p>Wind Speed</p>
            </div>
            <div className="precipitation">
              <p className="bold">
                {data.forecast.forecastday[0].day.totalprecip_in} in
              </p>
              <p>Precipitation</p>
            </div>
            <div className="temp-range">
              <p className="bold">
                High:{" "}
                {fahrenheitToCelsius(
                  data.forecast.forecastday[0].day.maxtemp_f
                ).toFixed(1)}
                °C
              </p>
              <p className="bold">
                Low:{" "}
                {fahrenheitToCelsius(
                  data.forecast.forecastday[0].day.mintemp_f
                ).toFixed(1)}
                °C
              </p>
              <p>Temperature Range</p>
            </div>
          </div>
        )}
      </div>
      <div
        className="app2"
        style={{ paddingRight: "50px", paddingLeft: "50px, back" }}
      >
        {chartData.labels ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "14 Days Weather Data",
                },
              },
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
