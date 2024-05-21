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
            classes : vine.unionOfTypes([
                vine.array(vine.number()).minLength(1),
                vine.string(),
            ]).optional()
             
        })
    )),
};
