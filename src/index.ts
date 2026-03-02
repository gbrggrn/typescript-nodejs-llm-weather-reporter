import { generateForecast as scheduleClient } from './io/ollama-client.js'
import { getWeatherData } from '../src/io/weather-api.js'
import { getForecast } from '../src/io/weather-api.js'

const basePrompt: string = 'You are an expert agronomist and meteorologist. Your job is to take the weather data provided and generate a current weather report. Continous text and limit yourself to 500 characters. Data provided: '

async function testWeather(){
    console.log("[index]Fetching weather...");

    const weatherData = await getWeatherData(59.978816, 18.847416)

    console.dir(weatherData, { depth: null, colors: true})

    const forecastPackage = [
        { period: '24h', data: getForecast(weatherData, 24, '0-24hrs') },
        { period: '3d', data: getForecast(weatherData, 72, '3 days') },
        { period: '6d', data: getForecast(weatherData, 144, '6 days') },
        { period: '10d', data: getForecast(weatherData, 240, '10 days') }
    ]

    scheduleClient(basePrompt, forecastPackage)
}

testWeather();
        