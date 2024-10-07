import { AISlideGenProvider } from './aiSlideGenProvider';
import { Question, YearSemester, CompletionsLoopRecord, LLMExtractionResult, PastQuestions } from './pastQuestionModel';
import { promisify } from 'util';
import { exec } from 'node:child_process';
import path from 'path';
import fs from 'fs';
import { get_encoding, encoding_for_model, TiktokenModel } from "tiktoken";
import { PromptProperties } from './llm/promptProperties';
import { OpenAIModel } from './llm/openai/openaiModel';
import { OpenAIModelResponse } from './llm/openai/openaiModelResponse';
import { Settings } from './llm/settings';
import 'dotenv/config';
import { PromptPart } from './llm/promptPart';
import { C } from './common/c';

export class AISlideGenProviderImpl implements AISlideGenProvider {

    constructor() {
    }
    

    /**
     * Parses PDF file to text fast and highly accurately. 
     * Supports pdftext parser and requires pdftext library to be installed on the system.
     * @param pdfPath PDF file path
     * @param outputPath  Output path
     * @param options Options for the parser of choice and any virtual environment path to source.
     * @returns 
     */
    async pdfTextParse(pdfPath: string, outputPath: string, 
        options: { parser: string, envPath?: string }): Promise<string> {
        if (options.parser === 'pdftext') {
            const command = `pdftext ${pdfPath} --out_path ${outputPath} --keep_hyphens`;
            let fullCommand = '';
            if (options.envPath) {
                const venvPath = options.envPath;
                fullCommand = `source ${venvPath} && ${command} && deactivate`;
            } else {
                fullCommand = `${command}`;
            }

            const execAsync = promisify(exec)
            const { stdout, stderr } = await execAsync(fullCommand)

            if (stderr) {
                //throw new Error(stderr);
                console.error("Exec error or warning: ", stderr);
                if (!fs.existsSync(outputPath)) {
                    throw new Error('PDF text extraction failed.');
                }
            }
            if (!fs.existsSync(outputPath)) {
                throw new Error('PDF text extraction failed.');
            }

            const buffer = fs.readFileSync(outputPath);
            const extractedRawText = buffer.toString();

            return extractedRawText;

        } else {
            throw new Error('Unsupported parser.');
        }
    }
    calculateTextTokenCount(text: string, model: string): number {
        const enc = encoding_for_model( model as TiktokenModel);

        const tokens = enc.encode(text);
        
        enc.free();

        return tokens.length;
    }
    calculateImageTokenCount(imagePath: string): number {
        //TODO
        return 0;
    }
    calculateOpenAIModelCost(inTokenCount: number, outTokenCount: number, 
        costPerInToken: number, costPerOutToken: number): number {
        return (costPerInToken * inTokenCount) + (costPerOutToken * outTokenCount);
    }
    concatStringArray(stringArray: string[]): string {
        let concat = ""
        stringArray.forEach((text) => {
            concat += text + " ";
        })
        return concat.trim();
    }
    async extractStructuredData(pdfText: string | string[], totalQuestions: number, 
        totalYears: number, completionLoopControl: string, settings: Settings, 
        retrievedQuestionsMap: Map<string, Question[]>, 
        retrievedQuestionsTotal: Question[], retrievedYearsTotal: YearSemester[], 
        loopRecord: CompletionsLoopRecord): Promise<LLMExtractionResult | null> {
        
        loopRecord.loop_count++;

        //call openai API here
        const prompt = new PromptProperties();
        
        prompt.messages.push({role: C.SYSTEM_ROLE, content: settings.system_prompt});

        if (Array.isArray(pdfText)) {
            const promptParts: PromptPart[] = [];
            pdfText.forEach((text: string) => {
                if (this.isValidURL(text)) {
                    promptParts.push({image_url: {url: text}, type: 'image_url'});
                } else {
                    promptParts.push({text: text, type: 'text'});
                }
            });
            prompt.messages.push({role: C.USER_ROLE, content: promptParts});
            //console.log("Prompt Parts Length: " + promptParts.length)
        } else {
            prompt.messages.push({role: C.USER_ROLE, content: pdfText});
        }

        prompt.model = C.DEFAULT_OPENAI_MODEL;
        prompt.max_token_length = settings.max_token_length;
        prompt.frequency_penalty = settings.freq_penalty;
        prompt.presence_penalty = settings.presence_penalty;
        prompt.temperature = settings.temperature;
        prompt.top_p = settings.top_p;
        prompt.stop_sequence = settings.stop_sequence;

        const openai = new OpenAIModel();
        const oaiRes: OpenAIModelResponse = await openai.generateText(prompt) as OpenAIModelResponse; // can check instance in the future

        const outTokensCount = oaiRes.usage?.completion_tokens; //ConvoUtils.textTokenCount(oaiRes.choices[0].message.content);
        const totalTokens = oaiRes.usage?.total_tokens;

        loopRecord.aggregate_tokens += totalTokens!!;

        //console.log("Actual Out Tokens: " + outputTokens);
        //console.log("Actual Total Tokens: " + totalTokens);

        const inTokenCount = this.calculateTextTokenCount(
            Array.isArray(pdfText)? this.concatStringArray(pdfText) 
            : pdfText, settings.model);
        const openAICost = this.calculateOpenAIModelCost(inTokenCount, outTokensCount!!, 
            settings.cost_per_in_tokens, settings.cost_per_out_tokens);

        loopRecord.aggregate_cost += openAICost;

        const role = oaiRes.choices[0].message.role;
        const jsonDataExtract = 
            oaiRes.choices[0].message.content?.replace('```json', 
            '').replace('```', '');

        //jsonDataExtract = sanitizeJSON(jsonDataExtract!!);

        const pastQuestionsJson = JSON.parse(jsonDataExtract!!) as PastQuestions;

        const yearsSemesters = pastQuestionsJson.years_semesters; //All the years/semesters for this iteration

        const questions: Question[] = []; // All the questions for this iteration irrespective of the year/semester or question number

        questions.push(...yearsSemesters[0].questions);

        //TODO support multiple years later
        /*yearsSemesters.forEach((ys: YearSemester) => {
            let qs = retrievedQuestionsMap.get(ys.year_semster);
            if (qs) {
                qs.push(...ys.questions); //update
            } else {
                qs = ys.questions; //fresh
            }
            retrievedQuestionsMap.set(ys.year_semster, qs); // map years/semesters to their questions for some reason
            questions.push(...ys.questions); // All the questions for this iteration irrespective of the year/semester or question number
            //Only add years/semesters if they arent already in the array
            const curYS = retrievedYearsTotal.find(thisYS => thisYS.year_semster === ys.year_semster);
            if (!curYS) {
                retrievedYearsTotal.push(ys);
            } else {
                // Get the year/semester already in the array and update it's questions.
                // Only add questions that aren't already in the array
                ys.questions.forEach( (q) => {
                    if (!curYS.questions.find( curQ => curQ.question === q.question)) {
                        curYS.questions.push(q);
                    }
                })
            }
        });*/

        retrievedQuestionsTotal.push(...questions); // update the total number of questions extracted so far

        const questionsExtractedCount = questions.length; // number of questions extracted in this iteration
        
        const yearsSemestersExtractedCount = yearsSemesters.length; // number of years/semesters extracted in this iteration
        
        if (retrievedQuestionsTotal.length >= totalQuestions) { //retrievedQuestionsTotal.length === totalQuestions) {

            pastQuestionsJson.years_semesters[0].questions = retrievedQuestionsTotal; //retrievedYearsTotal;

            return { past_questions: pastQuestionsJson, loop_record: loopRecord };
        }

        const curSysPrompt = settings.system_prompt;
        const newCompletionLoopControl = `Start from question number ${questions[questionsExtractedCount - 1].question_number + 1} down to as much as possible. Generate as much as you can without exceeding the maximum completion tokens or outputing an invalid JSON. You can do 10 to 15 at a time.`
        
        curSysPrompt.replace(completionLoopControl, "replaceValue");
        completionLoopControl = newCompletionLoopControl;
        settings.system_prompt = curSysPrompt;

        //Cut already processed sections out here.
        let usedSectionStartText = questions[0].question_number + "."; //questions[0].question_number + ". " + questions[0].question;

        //Start cutting sections out from an instruction/passage/illustration link.
        const instrLength = questions[0].instruction.length;
        const passLength = questions[0].passage.length;
        const illusLength = questions[0].illustration.length;
        if (instrLength > 0) {
            //if instruction is available, then start cutting from there assumming it's
            // before the question.
            const prefixCalc = 10 / 100 * questions[0].instruction.length;
            const prefixLength = prefixCalc < 10 ? 
                questions[0].instruction.length : prefixCalc;
            usedSectionStartText = questions[0].instruction.substring(0, prefixLength);
        } else if (instrLength === 0 && passLength > 0) {
            //if passage is available and instruction isn't, then start cutting from there assumming it's
            // before the question.
            const prefixCalc = 10 / 100 * questions[0].passage.length;
            const prefixLength = prefixCalc < 10 ? 
                questions[0].passage.length : prefixCalc;
            usedSectionStartText = questions[0].passage.substring(0, prefixLength);
        } else if (instrLength === 0 && illusLength > 0) {
            //if illustration available and instruction isn't available, then cut from there assuming it's
            // before the question.
            usedSectionStartText = questions[0].illustration;
        }

        const usedSectionStartAlts = [
            questions[0].question_number + " " + questions[0].question, 
            questions[0].question_number + "." + questions[0].question, 
            questions[0].question_number + "" + questions[0].question,
            questions[0].question_number + ". " + questions[0].instruction,
            questions[0].question_number + " " + questions[0].instruction,
            questions[0].question_number + "." + questions[0].instruction,
            questions[0].question_number + "" + questions[0].instruction,
            questions[0].question_number + ". " + questions[0].passage,
            questions[0].question_number + " " + questions[0].passage,
            questions[0].question_number + "." + questions[0].passage,
            questions[0].question_number + "" + questions[0].passage,
            questions[0].question_number + ". " + questions[0].illustration,
            questions[0].question_number + " " + questions[0].illustration,
            questions[0].question_number + "." + questions[0].illustration,
            questions[0].question_number + "" + questions[0].illustration
        ];

        const usedSectionStartAlts1 = [
            questions[0].question_number + ".",
            questions[0].question_number + ""
        ];

        const lastQuestion = questions[questionsExtractedCount - 1];
        const lastQuestionOpts = lastQuestion.options;
        const lastOption = lastQuestionOpts[lastQuestionOpts.length - 1];
        const usedSectionEndText = lastOption.option_letter + ". " + lastOption.option_text;

        const usedSectionEndAlts = [
            lastOption.option_letter + " " + lastOption.option_text,
            lastOption.option_letter + "." + lastOption.option_text,
            lastOption.option_letter + "" + lastOption.option_text,
            lastOption.option_letter + ". " + lastOption.option_illustration,
            lastOption.option_letter + " " + lastOption.option_illustration,
            lastOption.option_letter + "." + lastOption.option_illustration,
            lastOption.option_letter + "" + lastOption.option_illustration,
            lastQuestion.options_illustration
        ];

        const sectionedPdfText = this.sliceByUsedUpSection(pdfText, 
            usedSectionStartText, usedSectionEndText, 
            usedSectionStartAlts1, usedSectionEndAlts);

        const rePartitionedPdfText = this.sliceUpByMarkdownURLs(sectionedPdfText);

        return await this.extractStructuredData(rePartitionedPdfText, totalQuestions,  totalYears, 
            completionLoopControl, settings, retrievedQuestionsMap, 
            retrievedQuestionsTotal, retrievedYearsTotal, loopRecord);

    }
    sanitizeJSON(jsonStr: string): string {
        // Remove any non-printable characters
        let sanitized = jsonStr.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

        // Remove any text outside the main curly braces
        sanitized = sanitized.replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1');

        // Ensure the input starts and ends with curly braces
        sanitized = sanitized.trim();
        if (!sanitized.startsWith('{')) sanitized = '{' + sanitized;
        if (!sanitized.endsWith('}')) sanitized += '}';

        // Attempt to remove comments and whitespace outside of strings
        sanitized = sanitized.replace(/\/\/.*|\/\*[\s\S]*?\*\/|\s+(?=([^"]*"[^"]*")*[^"]*$)/g, '');

        // Replace single quotes with double quotes
        sanitized = sanitized.replace(/'/g, '"');

        // Remove trailing commas in objects and arrays
        sanitized = sanitized.replace(/,\s*([\]}])/g, '$1');

        // Add missing quotes to property names
        sanitized = sanitized.replace(/(\w+)(?=\s*:)/g, '"$1"');

        // Add missing colons after property names
        sanitized = sanitized.replace(/"([^"]+)"\s*(?!:)/g, '"$1":');

        // Handle unquoted string values
        sanitized = sanitized.replace(/:\s*([a-zA-Z0-9_]+)/g, ':"$1"');

        // Remove any "undefined" values
        sanitized = sanitized.replace(/"[^"]+"\s*:\s*undefined\s*,?/g, '');

        // Add missing commas between key-value pairs
        sanitized = sanitized.replace(/}(?!\s*[,}\]])/g, '},');
        sanitized = sanitized.replace(/](?!\s*[,}\]])/g, '],');

        // Add missing commas in arrays
        sanitized = sanitized.replace(/](?!\s*[,}\]])/g, '],');

        // Balance brackets and braces
        const balanceBrackets = (str: string, open: string, close: string) => {
            let count = 0;
            for (let char of str) {
                if (char === open) count++;
                if (char === close) count--;
            }
            return str + close.repeat(Math.max(0, count));
        };
        sanitized = balanceBrackets(sanitized, '{', '}');
        sanitized = balanceBrackets(sanitized, '[', ']');

        // Attempt to parse and re-stringify to fix any remaining issues
        try {
            const parsed = JSON.parse(sanitized);
            return JSON.stringify(parsed);
        } catch (error) {
            // If parsing fails, return the sanitized string as is
            console.warn("Warning: Could not fully sanitize JSON. Some issues may remain.");
            return sanitized;
        }
    }
    sliceUpByMarkdownURLs(extractedText: string): string[] {
        const result: string[] = [];
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(extractedText)) !== null) {
            // Add text slice before the link
            if (match.index > lastIndex) {
                result.push(extractedText.slice(lastIndex, match.index));
            }

            // Add the link text
            //result.push(match[1]);

            // Add the link URL
            result.push(match[2]);

            lastIndex = regex.lastIndex;
        }

        // Add remaining text after the last link
        if (lastIndex < extractedText.length) {
            result.push(extractedText.slice(lastIndex));
        }

        return result;
    }
    isValidURL(link: string): boolean {
        if (!link || link.length === 0)
            return false;

        return /^(https:\/\/)(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/\S*)?$/i.test(link);
    }
    sliceByUsedUpSection(extractedText: string | string[], usedSectionStartText: string, 
        usedSectionEndText: string, usedSectionStartAlts: string[], 
        usedSectionEndAlts: string[]): string {
        
        //Remove the used up section of the text from the extracted text. 
        //Any section of extracted text that has been made structured already doens't have to go 
        //in with the others in the completions loop. This is to save tokens and not confuse 
        //the LLM.

        let text = "";

        if (Array.isArray(extractedText)) {
            text = extractedText.join('\n');
        } else text = extractedText;

        let start = text.indexOf(usedSectionStartText);
        let end = text.indexOf(usedSectionEndText);

        let endTextLength = usedSectionEndText.length;

        if (start === -1) {
            // try the alternatives
            usedSectionStartAlts.every((alt) => {
                start = text.indexOf(alt);
                if (start !== -1) {
                    return false;
                }
                return true;
            })
        }

        if (end === -1) {
            // try the alternatives
            usedSectionEndAlts.every((alt) => {
                end = text.indexOf(alt);
                if (end !== -1) {
                    endTextLength = alt.length;
                    return false;
                }
                return true;
            })
        }

        //final check. if either start or end is still -1 then return original string
        if (start === -1 || end === -1) {
            return text;
        }

        return text.slice(0, start) + text.slice(end + endTextLength);
    }
    
}