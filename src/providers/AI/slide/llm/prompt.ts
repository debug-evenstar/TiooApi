import { PromptPart } from "./promptPart";

export class Prompt {
    role: string | undefined;
    content: string | Array<PromptPart> | null | undefined;

    constructor() {
        
    }
}