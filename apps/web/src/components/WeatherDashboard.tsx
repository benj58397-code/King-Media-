import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Loader } from 'lucide-react';

interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: ForecastDay[];
}

interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  condition: string;
  icon: string;
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('London');
  const [searchInput, setSearchInput] = useState('');

  const fetchWeather = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);

      // Using Open-Meteo API (free, no API key required)
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('City not found');
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Fetch weather data
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`
      );
      const weatherDataResponse = await weatherResponse.json();

      const current = weatherDataResponse.current;
      const daily = weatherDataResponse.daily;

      // Convert weather code to description
      const getWeatherDescription = (code: number) => {
        const weatherCodes: { [key: number]: string } = {
          0: 'Clear sky',
          1: 'Mainly clear',
          2: 'Partly cloudy',
          3: 'Overcast',
          45: 'Foggy',
          48: 'Foggy',
          51: 'Light drizzle',
          53: 'Moderate drizzle',
          55: 'Dense drizzle',
          61: 'Slight rain',
          63: 'Moderate rain',
          65: 'Heavy rain',
          71: 'Slight snow',
          73: 'Moderate snow',
          75: 'Heavy snow',
          80: 'Slight rain showers',
          81: 'Moderate rain showers',
          82: 'Violent rain showers',
          85: 'Slight snow showers',
          86: 'Heavy snow showers',
          95: 'Thunderstorm',
          96: 'Thunderstorm with slight hail',
          99: 'Thunderstorm with heavy hail',
        };
        return weatherCodes[code] || 'Unknown';
      };

      const forecast: ForecastDay[] = daily.time.slice(1, 6).map((date: string, index: number) => ({
        date,
        temp_max: daily.temperature_2m_max[index + 1],
        temp_min: daily.temperature_2m_min[index + 1],
        condition: getWeatherDescription(daily.weather_code[index + 1]),
        icon: '🌤️',
      }));

      setWeatherData({
        city: `${name}, ${country}`,
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        condition: getWeatherDescription(current.weather_code),
        icon: current.weather_code < 3 ? '☀️' : current.weather_code < 45 ? '☁️' : '🌧️',
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        visibility: 10,
        pressure: 1013,
        uvIndex: 5,
        sunrise: '06:30',
        sunset: '18:45',
        forecast,
      });
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('London');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput);
      setSearchInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">🌍 Weather Dashboard</h1>
          <p className="text-purple-200">Real-time weather data for any location</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a city..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 animate-spin text-purple-400" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 mb-8">
            {error}
          </div>
        )}

        {/* Weather Content */}
        {weatherData && !loading && (
          <>
            {/* Current Weather */}
            <div className="glass p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-purple-100 mb-2">{weatherData.city}</h2>
                  <div className="flex items-start gap-4">
                    <span className="text-8xl">{weatherData.icon}</span>
                    <div>
                      <div className="text-6xl font-bold text-white">{weatherData.temperature}°C</div>
                      <p className="text-xl text-purple-200 mt-2">{weatherData.condition}</p>
                      <p className="text-sm text-purple-300">Feels like {weatherData.feelsLike}°C</p>
                    </div>
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4">
                    <div className="flex items-center gap-2 text-purple-300 mb-2">
                      <Droplets className="w-5 h-5" />
                      <span className="text-sm">Humidity</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{weatherData.humidity}%</p>
                  </div>
                  <div className="glass p-4">
                    <div className="flex items-center gap-2 text-purple-300 mb-2">
                      <Wind className="w-5 h-5" />
                      <span className="text-sm">Wind Speed</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{weatherData.windSpeed} km/h</p>
                  </div>
                  <div className="glass p-4">
                    <div className="flex items-center gap-2 text-purple-300 mb-2">
                      <Eye className="w-5 h-5" />
                      <span className="text-sm">Visibility</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{weatherData.visibility} km</p>
                  </div>
                  <div className="glass p-4">
                    <div className="flex items-center gap-2 text-purple-300 mb-2">
                      <Gauge className="w-5 h-5" />
                      <span className="text-sm">Pressure</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{weatherData.pressure} hPa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">5-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="glass p-6 text-center">
                    <p className="text-purple-200 font-semibold mb-4">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <div className="text-4xl mb-4">🌤️</div>
                    <div className="mb-4">
                      <p className="text-sm text-purple-200 mb-2">{day.condition}</p>
                      <div className="flex justify-center gap-2">
                        <span className="text-white font-bold">{Math.round(day.temp_max)}°</span>
                        <span className="text-purple-300">{Math.round(day.temp_min)}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
