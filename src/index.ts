import { generateForecast as scheduleClient } from './io/ollama-client.js'
import { getWeatherData } from '../src/io/weather-api.js'
import { getForecast } from '../src/io/weather-api.js'
import { getBasePrompt } from './prompts/prompt-helper.js'

const basePrompt = getBasePrompt();

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
        