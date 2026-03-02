import { generateScheduleData as scheduleClient } from './io/ollama-client.js'
import { getWeather } from '../src/io/weather-api.js'

async function testWeather(): Promise<string> {
    console.log("[index]Fetching weather...");

    const weatherData = await getWeather(59.978816, 18.847416)

    console.dir(weatherData, { depth: null, colors: true})

    var dataString: string =
        `dewpoint(C): ${weatherData.dewPoint} | `+
        `min daily temp(C): ${weatherData.dayTemp.min} | `+
        `max daily temp(C): ${weatherData.dayTemp.max} |`+
        `rainfallMonth(mm): ${weatherData.rainfallMonth} |`+
        `rainfallDay(mm): ${weatherData.rainfallDay} |`+
        `rainfallHour(mm): ${weatherData.rainfallHour} |`+
        `pressure(hPa): ${weatherData.pressureHPa} |`+
        `wind(m/s): ${weatherData.wind} |`+
        `wind orientation(degrees): ${weatherData.windOrientDegrees} |`+
        `relative humidity(%): ${weatherData.relativeHumidity} |`+
        `sunshine latest hour: ${weatherData.sunshineLatestHour}`;

    return dataString
}
const basePrompt: string = 'You are an expert agronomist and meteorologist. Your job is to take the weather data provided and generate a current weather report. Continous text and limit yourself to 500 characters. Data provided: '


scheduleClient(basePrompt, await testWeather())
        