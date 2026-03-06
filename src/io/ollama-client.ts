import { Ollama } from 'ollama'
import type { WeatherForecast } from '../types/weather-forecast.type.js';
import type { Plant } from '../types/plant.type.js';

const remoteOllama = new Ollama({host: 'http://192.168.39.179:11434'})

/**
 * Package to make LLM-friendly formatting easier.
 */
export interface ForecastPackages {
    period: string,
    data: WeatherForecast
}

/**
 * Stringifies the ForecastPackages forces that + a base prompt to a remoteOllama model.
 * Prints the response to the console.
 * @param basePrompt The base prompt the model ingests
 * @param data ForecastPackages to be ingested
 */
export async function generateForecast(basePrompt: string, data: ForecastPackages[]): Promise<string> {
    console.log("[ollama-client] Generating forecast...")

    const weatherDataString = JSON.stringify(data, null, 2)
    const finalPrompt = `${basePrompt} \n\n ### CLIMATE WINDOWS DATA INPUT (JSON):\n${weatherDataString}`

    try {
        const response = await remoteOllama.generate({
            model: 'llama3.1', // Switch model here
            prompt: finalPrompt,
            stream: false
        });

        return `[ollama-client] Generated weather forecast: ${response.response}`
    } catch (error) {
        return `[ollama-client] Could not generate weather forecast: ${error}`
    }
}

export interface PlantPackages {
    plant: string
}

export async function generateGardenForecast(gardenPrompt: string, data: PlantPackages[], forecast: string): Promise<string>{
    console.log("[ollama-client] Generating garden forecast")

    const promptFinal = `${gardenPrompt} \n\n ### PLANTS INPUT:\n${data}\n\n ### WEATHER FORECAST: ${forecast}`

    try {
        const response = await remoteOllama.generate({
            model: 'llama3.1',
            prompt: promptFinal,
            stream: false
        })

        return `[ollama-client] Generated garden forecast: ${response.response}`
    } catch (error) {
        return `[ollama-client] Could not generate garden forecast: ${error}`
    }
}