const { createValidator } = require("./Base");

module.exports = {
    CreateLessonSlide: createValidator((vine) =>
        vine.object({
            slide_data: vine.array(),
            slide_index: vine.number(),
        })
    ),
};
