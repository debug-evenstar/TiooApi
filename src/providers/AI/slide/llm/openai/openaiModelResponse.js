
export class OpenAIModelResponse {
    id = '';
    choices = [];
    created = '';
    model = '';
    object = "chat.completion";
    system_fingerprint = ''
    usage = {};

    constructor() {
        
    }

    response() {
        return {
            id: this.id,
            choices: this.choices,
            created: this.created,
            model: this.model,
            object: this.object,
            system_fingerprint: this.system_fingerprint,
            usage: this.usage
        }
    }
    
    /*{
        "choices": [
            {
                "finish_reason": "stop",
                "index": 0,
                "message": {
                    "content": "The 2020 World Series was played in Texas at Globe Life Field in Arlington.",
                    "role": "assistant"
                },
                "logprobs": null
            }
        ],
        "created": 1677664795,
        "id": "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
        "model": "gpt-3.5-turbo-0613",
        "object": "chat.completion",
        "usage": {
            "completion_tokens": 17,
            "prompt_tokens": 57,
            "total_tokens": 74
        }
    }*/
}