import { Ollama } from 'ollama'
import type { WeatherForecast } from '../types/weather-forecast.type.js';

const remoteOllama = new Ollama({host: 'http://192.168.39.179:11434'})

async function pingAI() {
    console.log("[ollama-client] Verifying remote connection...")

    try {
        const response = await remoteOllama.generate({
            model: 'llama3.1',
            prompt: 'Say the words: Connection Successful',
            stream: false
        });

        console.log("[ollama-client] Response: ", response.response)
    } catch (error) {
        console.log("[ollama-client] Connection failed: ", error)
    }
}

export interface ForecastPackages {
    period: string,
    data: WeatherForecast
}

export async function generateForecast(basePrompt: string, data: ForecastPackages[]) {
    console.log("[ollama-client] Generating schedule data...")

    const weatherDataString = JSON.stringify(data, null, 2)
    const finalPrompt = `${basePrompt} \n\n Weather Forecast Data:\n${weatherDataString}`

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