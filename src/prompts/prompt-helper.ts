import fs from 'node:fs'
import path from 'node:path'

// Reads the base-prompt.md file

const promptPath = path.resolve(process.cwd(), 'src/prompts/base-prompt.md');

const basePrompt = fs.readFileSync(promptPath, 'utf-8');

const gardenPromptPath = path.resolve(process.cwd(), 'src/prompts/base-prompt.md');

const gardenPrompt = fs.readFileSync(gardenPromptPath, 'utf-8')

export function getBasePrompt(): string {
    return basePrompt;
}

export function getGardenForecastPrompt(): string {
    return gardenPrompt;
}