import fs from 'node:fs'
import path from 'node:path'

const promptPath = path.resolve(process.cwd(), 'src/prompts/base-prompt.md');

const basePrompt = fs.readFileSync(promptPath, 'utf-8');

export function getBasePrompt(): string {
    return basePrompt;
}