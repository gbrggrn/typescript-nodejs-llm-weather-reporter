import { generateForecast as scheduleClient } from './io/ollama-client.js'
import { getWeatherData } from '../src/io/weather-api.js'
import { getForecast } from '../src/io/weather-api.js'

const basePrompt = "You are a weather data analyst. I am providing a JSON array of four weather buckets (Today, Tomorrow, Rest of Week, Next Week). Your task: 1. Extract the minimum and maximum temperature from the entire 10-day period. 2. Calculate the total rainfall across all buckets. 3. Identify the windiest period. 4. Provide a 2-sentence summary of the weather trend. Please be terse and factual.";

async function testWeather(){
    console.log("[index]Fetching weather...");

    const weatherData = await getWeatherData(59.978816, 18.847416)

    console.dir(weatherData, { depth: null, colors: true})

    const forecastPackage = [
        { period: 'Today', data: getForecast(weatherData, 0, 24, 'Immediate') },
        { period: 'Tomorrow', data: getForecast(weatherData, 24, 24, 'Short-term') },
        { period: 'Rest of week', data: getForecast(weatherData, 48, 120, 'Mid-term') },
        { period: 'Next week', data: getForecast(weatherData, 168, 72, 'Long-term') }
    ]

    scheduleClient(basePrompt, forecastPackage)
}

testWeather();
        