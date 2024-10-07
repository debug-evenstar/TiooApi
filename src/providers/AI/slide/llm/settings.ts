export class Settings {
    temperature: number = 1.0
    max_token_length: number = 256
    stop_sequence: string = ''
    top_p: number = 1.0
    freq_penalty: number = 0
    presence_penalty: number = 0
    system_prompt: string = ''
    model = ''
    cost_per_in_tokens: number = 0.00
    cost_per_out_tokens: number = 0.00
}