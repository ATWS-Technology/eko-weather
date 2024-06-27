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

  const searchWeather = (event) => {
    if (event.key === "Enter") {
      setError("");
      setLoading(true);
      const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=lagos&dt=${date}`;
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
      setDate("");
    }
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
        const temperatures = responses.map(
          (response) => response.data.forecast.forecastday[0].day.avgtemp_f
        );

        setChartData({
          labels: dates.reverse(),
          datasets: [
            {
              label: "Average Temperature (°F)",
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

  return (
    <div className="app">
      <div className="search">
        <h2 style={{ padding: "20px 20px" }}>Welcome to Lagos State</h2>
        <input
          value={date}
          onChange={(event) => setDate(event.target.value)}
          onKeyPress={searchWeather}
          type="date"
          placeholder="Select Date"
        />
      </div>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.location ? data.location.name : null}</p>
          </div>
          <div className="temp">
            {data.forecast ? (
              <h1>{data.forecast.forecastday[0].day.avgtemp_f.toFixed()}°F</h1>
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
                  {data.forecast.forecastday[0].day.feelslike_f.toFixed()}°F
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
                High: {data.forecast.forecastday[0].day.maxtemp_f.toFixed()}°F
              </p>
              <p className="bold">
                Low: {data.forecast.forecastday[0].day.mintemp_f.toFixed()}°F
              </p>
              <p>Temperature Range</p>
            </div>
          </div>
        )}
      </div>
      <div className="chart">
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
