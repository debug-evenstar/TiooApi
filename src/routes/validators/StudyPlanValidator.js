const { createValidator } = require("./Base");

module.exports = {
    CreateSubject: createValidator((vine)=>(
        vine.object({
            name: vine.string(),
            description: vine.string(),
            default: vine.boolean().optional(),
            classes : vine.array(vine.number()).minLength(1),
            classArms : vine.array(vine.number()).optional()
        })
    )),
    UpdateSubject: createValidator((vine)=>(
        vine.object({
            name: vine.string(),
            description: vine.string(),
            classes : vine.array(vine.number()).minLength(1).optional(),
            classArms : vine.array(vine.number()).optional()
        })
    )),
};
