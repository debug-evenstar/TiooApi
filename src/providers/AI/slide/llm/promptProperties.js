import { Prompt } from './prompt';
export class PromptProperties {

    messages = [];
    model = "";
    frequency_penalty = 0;
    presence_penalty = 0;
    temperature = 1.0;
    max_token_length = 256;
    stop_sequence = ''
    top_p = 1.0;

    constructor() {
        
    }
}