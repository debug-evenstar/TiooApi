import { Settings } from "./llm/settings"
import { CompletionsLoopRecord, LLMExtractionResult, Question, YearSemester } from "./pastQuestionModel";

export interface AISlideGenProvider {

    pdfTextParse(pdfPath: string, outputPath: string, options: {parser: string, envPath?: string}): Promise<string>

    calculateTextTokenCount(text: string, model: string): number

    calculateImageTokenCount(imagePath: string): number

    calculateOpenAIModelCost(inTokenCount: number, outTokenCount: number, costPerInToken: number, costPerOutToken: number): number

    concatStringArray(stringArray: string[]): string

    extractStructuredData(pdfText: string | string[], 
        totalQuestions: number, totalYears: number,
        completionLoopControl: string, settings: Settings, 
        retrievedQuestionsMap: Map<string, Question[]>, 
        retrievedQuestionsTotal: Question[],
        retrievedYearsTotal: YearSemester[],
        loopRecord: CompletionsLoopRecord): Promise<LLMExtractionResult | null>

    sanitizeJSON(jsonStr: string): string

    sliceUpByMarkdownURLs(extractedText: string): string[]

    isValidURL(link: string): boolean

    sliceByUsedUpSection(extractedText: string | string[], usedSectionStartText: string, 
        usedSectionEndText: string, usedSectionStartAlts: string[], usedSectionEndAlts: string[]): string
}