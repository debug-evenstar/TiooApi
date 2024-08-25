const { createValidator } = require("./Base");
const { exists } = require("./custom/models");

module.exports = {
    CreateTextbook: createValidator((vine) =>
        vine.object({
            name: vine.string(),
            description: vine.string(),
            subject_id: vine.number().use(exists({ table: "subjects" })),
            classes: vine.unionOfTypes([
                vine.array(vine.number()).minLength(1),
                vine.string(),
            ]),
            plan: vine.string().optional()
        })
    ),
    UpdateTextbook: createValidator((vine) =>
        vine.object({
            name: vine.string(),
            description: vine.string(),
            subject_id: vine.number().optional(),
        })
    ),
    CreateTextbookLesson: createValidator((vine) =>
        vine.object({
            topic: vine.string(),
            description: vine.string().optional(),
            objectives: vine.string().optional(),
            curriculum: vine.string().optional(),
            duration: vine.string().optional(),
            additional_instruction: vine.string().optional(),
            chapter_id: vine.number(),
            class: vine.number().optional(),
        })
    ),
    CreateTextbookChapter: createValidator((vine) =>
        vine.object({
            name: vine.string(),
            description: vine.string().optional(),
            index: vine.number(),
        })
    ),
};
