class SystemPromptTemplate {

    examName = 'JAMB';
    subjectCourse = 'Mathematics';
    examType = 'Objective';

    constructor(examName, subjectCourse, examType) {
        this.examName = examName;
        this.subjectCourse = subjectCourse;
        this.examType = examType;
    }

    completionLoopControl = "Generate as much as you can without exceeding the maximum completion tokens or outputing an invalid JSON. You can do 10 to 15 at a time.";
    introInstructions = `You're a data expert that will convert these clump of ${this.examName} ${this.subjectCourse} ${this.examType} past questions text into a structured JSON data in the following format/template`;
    jsonTemplate = `{ 
    "name": "", 
    "subject_course": "", 
    "years_semesters": [{ 
    "year_semester": "", 
    "questions": [{ 
    "instruction": "", 
    "passage": "", 
    "illustration": "", 
    "constants_measurements": "", 
    "question_number": 1, 
    "question": "", 
    "options": [{ 
    "option_illustration": "", 
    "option_letter": "", 
    "option_text": "" 
    }], 
    "options_illustration": "", 
    "answer": "", 
    "workings": "" 
    }] 
    }]
    }. `;
    nameFieldDef = `name field is the name of the whole document.`;
    subjectCourseDef = `subject_course field is the subject or course of the past questions.`;
    yearsSemestersDef = `years_semesters is an object array for all the years or semesters of the course or subject past questions present in the data.`;
    yearSemesterDef = `That object has a year_semester field for the year/semester of that particular year/semester.`;
    questionsDef = `questions field is an object array for questions per year/semester,`;
    instructionDef = `that object has instruction field which is for any instructions or description of the illustration for a particular question or questions,`;
    passageDef = `passage field which is for any passage provided to help answer a question or group of questions,`;
    illustrationDef = `illustration field is the URL of the image to the illustration for that question,`;
    constantsMeasurementsDef = `constants_measurements field contains some constants or measurements that might come with some questions in chemistry, physics, etc and are sometimes after the options before the next question.`;
    questionNumberDef = `question_number field which is the number of the question for that year/semester,`;
    questionDef = `question field which is the question text,`;
    optionsDef = `options field which is an object array for the options.`;
    optionIllustrationDef = `The options field earlier contains the object array of a question's options. option_illustration field is a URL to an image of an option if it couldn't be represented as text. Leave it blank if no URL was included.`;
    optionLetterDef = `option_letter field is the alphabet of the option.`;
    optionTextDef = `option_text field is the option's text.`;
    optionsIllustrationDef = `options_illustration field is a URL to an image that represents the options to the question if they couldn't be represented as text.`;
    answerDef = `answer field which is the right answer text and option letter to the question which you will work out and only pick from the options of that question. If not available, make that field null.`;
    workingsDef = `workings field will contain the workings to the answer to the question in as short as possible text. If there is an illustration provided for a question you must use that to try and work out the answer. If answer isn't available amongst the options, also make workings field null.`;
    templateFieldDefinitions = `The data might have multiple years/semesters to sort out. Structure accordingly. ${this.nameFieldDef} ${this.subjectCourseDef} ${this.yearsSemestersDef} ${this.yearSemesterDef} ${this.questionsDef} ${this.instructionDef} ${this.passageDef} ${this.illustrationDef} ${this.constantsMeasurementsDef} ${this.questionNumberDef} ${this.questionDef} ${this.optionsDef} ${this.optionsIllustrationDef} ${this.optionsIllustrationDef} ${this.answerDef} ${this.workingsDef} ${this.optionIllustrationDef} ${this.optionLetterDef} ${this.optionTextDef}`
    filterInstructions = `The prompt might come in parts of text and image URL. Use the image URLs sent in prompt image parts to answer a question or questions sent in prompt text parts before or after it. URLs will either preceed or follow a question or questions, usually after an instruction, so check properly and use accordingly. The text or document may contain noise, strings of text that don't belong (urls that don't belong, watermarks, ads etc) or some that has been misplaced in a place it isn't supposed to be (years of each past questions). Ignore the ones that don't matter to the overall output and use misplaced strings to further improve the overall output. Each question starts with a number and period sign. Make corrections to string of words that may be mistakenly joined together. If the text sent isn't a past questions, just return a JSON with empty values.`;
    closingInstructions = `${this.completionLoopControl} Follow the instructions to the letter. Produce only the JSON data and nothing else. Do not comment in the JSON as it will make it invalid. Do not exceed the maximum completion tokens so as to send an invalid JSON.`;

    sysPrompt = `${this.introInstructions} ${this.jsonTemplate} ${this.templateFieldDefinitions} ${this.filterInstructions} ${this.closingInstructions}`;
}

module.exports = SystemPromptTemplate;