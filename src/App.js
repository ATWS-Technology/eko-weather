import React, { useState } from 'react';
import axios from 'axios';


function App() {
  const [data, setData] = useState({});
  const [date, setDate] = useState('');

  const apiKey = '09cfbe33ba8641e1981113826242706';
  const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=lagos&dt=${date}`;

  const searchWeather = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setDate('');
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={date}
          onChange={event => setDate(event.target.value)}
          onKeyPress={searchWeather}
          type="date"
          placeholder="Select Date"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.location ? data.location.name : null}</p>
          </div>
          <div className="temp">
            {data.forecast ? <h1>{data.forecast.forecastday[0].day.avgtemp_f.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.forecast ? <p>{data.forecast.forecastday[0].day.condition.text}</p> : null}
          </div>
        </div>

        {data.location && data.forecast &&
          <div className="bottom">
            <div className="feels">
              {data.forecast.forecastday[0].day.feelslike_f ? <p className='bold'>{data.forecast.forecastday[0].day.feelslike_f.toFixed()}°F</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className='bold'>{data.forecast.forecastday[0].day.avghumidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="wind">
              <p className='bold'>{data.forecast.forecastday[0].day.maxwind_mph.toFixed()} MPH</p>
              <p>Wind Speed</p>
            </div>
            <div className="precipitation">
              <p className='bold'>{data.forecast.forecastday[0].day.totalprecip_in} in</p>
              <p>Precipitation</p>
            </div>
            <div className="temp-range">
              <p className='bold'>High: {data.forecast.forecastday[0].day.maxtemp_f.toFixed()}°F</p>
              <p className='bold'>Low: {data.forecast.forecastday[0].day.mintemp_f.toFixed()}°F</p>
              <p>Temperature Range</p>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
