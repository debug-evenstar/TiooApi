const { OpenAI } = require('openai');
const { PromptProperties } = require('../promptProperties');
const { OpenAIModelResponse } = require('./openaiModelResponse');

class OpenAIModel {
    openai;

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async generateText(prompt) {
        const arr = JSON.parse(JSON.stringify(prompt.messages));
        const completion = await this.openai.chat.completions.create({
            messages: arr,
            model: prompt.model,
            frequency_penalty: prompt.frequency_penalty,
            presence_penalty: prompt.presence_penalty,
            temperature: prompt.temperature,
            max_completion_tokens: prompt.max_token_length,
            stop: prompt.stop_sequence,
            top_p: prompt.top_p,
            /*stream: true,*/
            response_format: {
                "type": "text"
            },
        });

        const res = new OpenAIModelResponse();
        res.choices = completion.choices;
        res.created = completion.created;
        res.id = completion.id;
        res.model = completion.model;
        res.object = completion.object;
        res.system_fingerprint = completion.system_fingerprint;
        res.usage = completion.usage;

        return res;

        //streaming //--'completion' will now be 'stream'
        //for await (const chunk of stream) {
            //process.stdout.write(chunk.choices[0]?.delta?.content || "");
        //}
    }
}

module.exports = OpenAIModel;