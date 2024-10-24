
 const PastQuestions = {
    name: '',
    subject_course: '',
    years_semesters: [],
}

 const YearSemester = {
    year_semster: '',
    questions: [],
}

 const Question = {
    instruction: '',
    passage: '',
    illustration: '',
    constants_measurements: [],
    question_number: '',
    question: '',
    options: '',
    options_illustration: '',
    answer: '',
    workings: '' //explanation for non-calculation questions
}

 const Option = {
    option_illustration: '',
    option_letter: '',
    option_text: ''
}

 const Char = 'A' || 'B' || 'C' || 'D' || 'E' || 'F' || 'G' || 'H' || 'I' || 
'J' || 'K' || 'L' || 'M' || 'N' || 'O' || 'P' || 'Q' || 'R' || 'S' || 'T' || 'U' || 'V' 
|| 'W' || 'X' || 'Y' || 'Z' || '0';

 const CompletionsLoopRecord = {
    loop_count: 0,
    aggregate_tokens: 0,
    aggregate_cost: 0
}

 const LLMExtractionResult = {
    past_questions: {},
    loop_record: {}
}

module.exports = { PastQuestions, YearSemester, Question, Option, Char, CompletionsLoopRecord, LLMExtractionResult };