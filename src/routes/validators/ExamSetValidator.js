const { createValidator } = require("./Base");

module.exports = {
  CreateExamSet: createValidator((vine) => (
    vine.object({
      name: vine.string(),
      data: vine.array(vine.object({
        subject_id: vine.number(),
        lessons: vine.array(),
      })),
    })
  )),

  UpdateExamSet: createValidator((vine) => (
    vine.object({
      name: vine.string(),
      data: vine.array(vine.object({
        subject_id: vine.number(),
        lessons: vine.array(),
      })),
    })
  )),
};
