import { generateScheduleData as scheduleClient } from './io/ollama-client.js'
import { getWeathers } from '../src/io/weather-api.js'

scheduleClient();

testWeather()

async function testWeather() {
    console.log("[index]Fetching weather...");

    const weatherData = await getWeathers(59.978816, 18.847416)

    console.dir(weatherData, { depth: null, colors: true})
}