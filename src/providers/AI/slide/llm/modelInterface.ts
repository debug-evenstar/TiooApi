import { ModelResponseInterface } from "./modelResponseInterface";
import { PromptProperties } from "./promptProperties";

export interface ModelInterface {
    generateText(prompt: PromptProperties): Promise<ModelResponseInterface>
}