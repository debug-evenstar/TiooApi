const { Op } = require("sequelize");
const ResponseMessage = require("../config/message.config");
const { ExamSet, Subject, Textbook, Lesson, Exam, LessonSlide, Account, AccountExam } = require("../database/connection");

class ExamSetController {

    static async getSetByExam(req, res) {
        const { exam_id } = req.params;

        const set = await ExamSet.findOne({
            where: {
                exam_id: exam_id,
                active: true,
            },
            attributes: ['id','name']
        })

        if (set) {
            return res.send({
                error: false,
                data: set
            });
        }

        return res.status(404).send({
            error: true,
            message: "Not found",
        });

    }


    static async getExamSet(req, res) {
        const { set_id } = req.params;
        const user_id = req.userData.id;

        const set = await ExamSet.findByPk(set_id);

        if (set == null) {
            return res.status(404).send({
                error: true,
                message: "Not found",
            })
        }

        const accountExam = await AccountExam.findOne({
            where: {
                account_id: user_id,
                exam_id: set.exam_id,
            }
        });
        
        const userSubjectIds = accountExam.subjects?.map((sub) => sub.id);
        const setData = set.data.filter((i) => userSubjectIds.includes(i.subject_id));
        const subjectLessonMap = await Promise.all(setData.map(async item => {
            const subject = await Subject.findByPk(item.subject_id, {
                attributes: ['id', 'name']
            });
            const lesson = await Lesson.findByPk(item.lesson_id, {
                order: [
                    [{ model: LessonSlide, as: "lesson_slides" }, "slide_index", "ASC"]
                ],
                include: [
                    {
                        model: LessonSlide,
                        as: "lesson_slides",
                    },
                ],
            });

            return { subject, lesson }
        }));


        return res.send({
            error: false,
            data: { set, subjectLessonMap }
        });


    }

    static async getSets(req, res) {
        const { exam_id } = req.params;

        const sets = await ExamSet.findAll({
            where: {
                exam_id: exam_id
            }
        });
        return res.send({
            error: false,
            data: sets
        })
    }

    static async createSet(req, res) {
        const set = await ExamSet.create(req.body)
        return res.send({
            error: false,
            data: set
        })
    }

    static async updateSet(req, res) {
        const { id } = req.params;
        const set = await ExamSet.findByPk(id);
        if (set) {
            await set.update(req.body);
            return res.send({
                error: false,
                data: set
            })
        }
        return res.send({
            error: true,
            message: ResponseMessage.fail.not_found
        })

    }

    static async deleteSet(req, res) {
        const { id } = req.params;
        const set = await ExamSet.findByPk(id);
        if (set) {
            await set.destroy();
            return res.send({
                error: false,
                message: ResponseMessage.pass.delete
            })
        }
        return res.send({
            error: true,
            message: ResponseMessage.fail.not_found
        })
    }


    static async setActive(req, res) {
        const { id } = req.params;
        const set = await ExamSet.findByPk(id);
        if (set) {

            await ExamSet.update(
                { active: false },
                {
                    where: {
                        id: { [Op.not]: id }
                    }
                }
            );

            set.active = true;
            await set.save();
            return res.send({
                error: false,
                message: "Toggled status",
            });
        }

        return res.send({
            error: true,
            message: ResponseMessage.fail.not_found,
        })
    }

    static async getSubjectsWithLessons(req, res) {


        const { exam_id } = req.params;
        const subjects = await Subject.findAll({
            include: [
                {
                    model: Textbook,
                    where: {
                        book_type: {
                            [Op.like]: '%question%'
                        },
                    },
                    required: false,
                    attributes: ['id', 'name'],
                }
            ],
            attributes: ['id', 'name'],
        });

        const result = await Promise.all(subjects.map(async (sub) => {
            const lessons = await Promise.all(sub.Textbooks.map(async (book) => {
                const les = await Lesson.findAll({
                    where: { textbook_id: book.id },
                    attributes: ['id', 'topic', 'created_at', 'updated_at'],
                });
                return les;
            }));

            return { ...{ id: sub.id, name: sub.name }, lessons: lessons.flat() };
        }));

        return res.send({
            error: false,
            data: result
        });
    }

}

module.exports = ExamSetController;