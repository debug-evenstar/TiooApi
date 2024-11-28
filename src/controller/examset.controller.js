const { Op } = require("sequelize");
const ResponseMessage = require("../config/message.config");
const { ExamSet, Subject, Textbook, Lesson } = require("../database/connection");

class ExamSetController {


    static async getSets(req, res) {
        const sets = await ExamSet.findAll();
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


    static async setStatus(req,res){
        const { id } = req.params;
        const set = await ExamSet.findByPk(id);
        if(set){
            set.status = req.body.status;
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
                    attributes: ['id','topic','created_at','updated_at'],
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