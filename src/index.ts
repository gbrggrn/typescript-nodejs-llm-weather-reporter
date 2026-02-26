import { Ollama } from 'ollama'

const remoteOllama = new Ollama({host: 'http://192.168.39.179:11434'});

async function pingAI () {
    console.log("Attempting to connect to Ollama stationary...");

    try {
        const response = await remoteOllama.generate({
            model: 'llama3.1',
            prompt: 'Say the words: Connection Successful.',
            stream: false
        });

        console.log("AI response: ", response.response)
    } catch (error) {
        console.error("Connection failed. Is the stationary port open?", error)
    }
}

pingAI()