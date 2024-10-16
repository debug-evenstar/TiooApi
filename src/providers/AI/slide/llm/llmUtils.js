import { C } from "../common/c";
import { Settings } from "./settings";
import { PromptProperties } from "./promptProperties";

export const initPromptProperties = (message, settings) => {
    const prompt = new PromptProperties();
    prompt.messages[0] = {role: "system", content: settings.system_prompt};
    prompt.messages[1] = {role: "user", content: message};
    prompt.model = C.DEFAULT_OPENAI_MODEL;
    prompt.max_token_length = settings.max_token_length;
    prompt.frequency_penalty = settings.freq_penalty;
    prompt.presence_penalty = settings.presence_penalty;
    prompt.temperature = settings.temperature;
    prompt.top_p = settings.top_p;
    prompt.stop_sequence = settings.stop_sequence;

    return prompt;
}