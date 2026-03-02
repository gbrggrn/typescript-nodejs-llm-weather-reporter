import { Ollama } from 'ollama'

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

export async function generateScheduleData(basePrompt: string, data: string) {
    console.log("[ollama-client] Generating schedule data...")

    try {
        const response = await remoteOllama.generate({
            model: 'llama3.1',
            prompt: basePrompt + ' | ' + data,
            stream: false
        });

        console.log("[ollama-client] Generated schedule data: ", response.response)
    } catch (error) {
        console.log("[ollama-client] Could not generate schedule data: ", error)
    }
}