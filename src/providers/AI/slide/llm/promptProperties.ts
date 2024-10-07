import { Prompt } from './prompt';
export class PromptProperties {

    messages: Array<Prompt> = [];
    model: string = "";
    frequency_penalty: number = 0;
    presence_penalty: number = 0;
    temperature: number = 1.0;
    max_token_length: number = 256;
    stop_sequence: string = ''
    top_p: number = 1.0;

    constructor() {
        
    }
}