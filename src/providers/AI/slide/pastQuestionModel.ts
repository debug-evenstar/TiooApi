
export type PastQuestions = {
    name: string,
    subject_course: string,
    years_semesters: YearSemester[]
}

export type YearSemester = {
    year_semster: string,
    questions: Question[]
}

export type Question = {
    instruction: string,
    passage: string,
    illustration: string,
    constants_measurements: string,
    question_number: number,
    question: string,
    options: Option[],
    options_illustration: string,
    answer: string,
    workings?: string //explanation for non-calculation questions
}

export type Option = {
    option_illustration: string,
    option_letter: Char,
    option_text: string
}

export type Char = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' 
| 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' 
| 'Y' | 'Z' | '0'

export type CompletionsLoopRecord = {
    loop_count: number,
    aggregate_tokens: number
    aggregate_cost: number
}

export type LLMExtractionResult = {
    past_questions: PastQuestions,
    loop_record: CompletionsLoopRecord
}