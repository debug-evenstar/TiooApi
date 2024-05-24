const { createValidator } = require("./Base");

module.exports = {
    CreateTextbook: createValidator((vine)=>(
        vine.object({
            name: vine.string(),
            description: vine.string(),
            subject_id: vine.number(),
            classes : vine.unionOfTypes([
                vine.array(vine.number()).minLength(1),
                vine.string(),
            ])
             
        })
    )),
    UpdateTextbook: createValidator((vine)=>(
        vine.object({
            name: vine.string(),
            description: vine.string(),
            subject_id: vine.number().optional(),
        })
    )),
    CreateTextbookLesson: createValidator((vine)=>(
        vine.object({
            topic: vine.string(),
            description: vine.string(),
            objectives: vine.string().optional(),
            curriculum: vine.string().optional(),
            duration: vine.string().optional(),
            additional_instruction: vine.string().optional(),
            chapter: vine.number().optional(),
            class : vine.number().optional(),
        })
    )),
};
