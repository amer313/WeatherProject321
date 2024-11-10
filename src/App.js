import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Recommendation from './components/Recommendation';
import Header from './components/Header';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [units, setUnits] = useState('imperial');
  const [darkMode, setDarkMode] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false); // Modal visibility state

  const weatherApiKey = '895284fb2d2c50a520ea537456963d9c';
  const unsplashAccessKey = 'FtmFZv1ckfIqTD2DMtmVqyu9BCTsUKB8B-IcCcEudEs';

  const fetchWeatherByCoords = async (lat, lon) => {
    setIsLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;
    try {
      const response = await axios.get(url);
      setData(response.data);
      fetchBackgroundImage(response.data.name);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setIsLoading(false);
    }
  };

  const fetchBackgroundImage = async (locationName) => {
    if (!locationName) return;
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${locationName}&client_id=${unsplashAccessKey}`;
    try {
      const response = await axios.get(unsplashUrl);
      setBackgroundImage(response.data.urls.full);
    } catch (error) {
      console.error('Error fetching background image:', error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
      }
    );
  }, []);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      setIsLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}`;
      axios.get(url)
        .then((response) => {
          setData(response.data);
          fetchBackgroundImage(response.data.name);
          setLocation('');
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error searching location:', error);
          setIsLoading(false);
          setShowErrorModal(true); // Show modal on error
        });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getWindDirection = (degree) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.floor((degree + 22.5) / 45) % 8;
    return directions[index];
  };
  const temperatureInCelsius = data.main ? data.main.temp - 273.15 : null;
  const feelsLikeInCelsius = data.main ? data.main.feels_like - 273.15 : null;
  
  const displayTemperature = units === 'imperial'
    ? ((temperatureInCelsius * 9 / 5) + 32).toFixed(1)
    : temperatureInCelsius.toFixed(1);
  
  const displayFeelsLike = units === 'imperial'
    ? ((feelsLikeInCelsius * 9 / 5) + 32).toFixed(1)
    : feelsLikeInCelsius.toFixed(1);  

  const toggleUnits = () => {
    setUnits(units === 'imperial' ? 'metric' : 'imperial');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const weatherDescription = data.weather ? data.weather[0].description : '';
  const locationName = data.name;
  const locationCountry = data.sys ? data.sys.country : '';

  return (
    <div
      className={`app ${darkMode ? 'dark' : ''}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.5s ease-in-out'
      }}
    >
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <Header
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            toggleUnits={toggleUnits}
            units={units}
            location={location}
            setLocation={setLocation}
            searchLocation={searchLocation}
          />

          <div className="container">
            <div className="top">
              <div className="weather-info">
                <div className="location">
                  <p>{locationName}, {locationCountry}</p>
                </div>
                <div className="temp">
                  {displayTemperature ? <h1 className="big-temp">{displayTemperature}°</h1> : null}
                </div>
                <div className="description">
                  {data.weather ? <p>{data.weather[0].description}</p> : null}
                </div>
              </div>
            </div>

            {data.name && (
              <div className="bottom">
                <div className="feels">
                  {data.main ? <p className="bold">{displayFeelsLike}°</p> : null}
                  <p>Feels Like</p>
                </div>
                <div className="humidity">
                  {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
                  <p>Humidity</p>
                </div>
                <div className="wind">
                  {data.wind ? <p className="bold">{data.wind.speed.toFixed()} {units === 'imperial' ? 'MPH' : 'm/s'}</p> : null}
                  {data.wind ? <p>{getWindDirection(data.wind.deg)}</p> : null}
                  <p>Wind Speed & Direction</p>
                </div>
                <div className="visibility">
                  {data.visibility ? <p className="bold">{(data.visibility / 1000).toFixed(1)} km</p> : null}
                  <p>Visibility</p>
                </div>
                <div className="clouds">
                  {data.clouds ? <p className="bold">{data.clouds.all}%</p> : null}
                  <p>Cloudiness</p>
                </div>
              </div>
            )}

            {data.sys && (
              <div className="sun-times">
                <div className="sunrise">
                  <span role="img" aria-label="sunrise">🌅</span> {formatTime(data.sys.sunrise)}
                  <p>Sunrise</p>
                </div>
                <div className="sunset">
                  <span role="img" aria-label="sunset">🌇</span> {formatTime(data.sys.sunset)}
                  <p>Sunset</p>
                </div>
              </div>
            )}

            <Recommendation 
              temperature={temperatureInCelsius}
              weatherDescription={weatherDescription}
              units={units}
              humidity={data.main ? data.main.humidity : null}
              cloudiness={data.clouds ? data.clouds.all : null}
              visibility={data.visibility ? data.visibility / 1000 : null}
              windSpeed={data.wind ? data.wind.speed : null}
              location={locationName}
            />
          </div>

          {/* Error Modal */}
          {showErrorModal && (
            <div className="modal">
              <div className="modal-content">
                <p>Location not found. Please try again.</p>
                <button onClick={() => setShowErrorModal(false)}>Close</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
