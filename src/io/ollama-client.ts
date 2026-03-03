import { Ollama } from 'ollama'
import type { WeatherForecast } from '../types/weather-forecast.type.js';

const remoteOllama = new Ollama({host: 'http://192.168.39.179:11434'})

export interface ForecastPackages {
    period: string,
    data: WeatherForecast
}

export async function generateForecast(basePrompt: string, data: ForecastPackages[]) {
    console.log("[ollama-client] Generating forecast...")

    const weatherDataString = JSON.stringify(data, null, 2)
    const finalPrompt = `${basePrompt} \n\n ### DATA INPUT (JSON):\n${weatherDataString}`

    try {
        const response = await remoteOllama.generate({
            model: 'llama3.1',
            prompt: finalPrompt,
            stream: false
        });

        console.log("[ollama-client] Generated forecast: ", response.response)
    } catch (error) {
        console.log("[ollama-client] Could not generate forecast: ", error)
    }
}