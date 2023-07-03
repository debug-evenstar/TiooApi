const { Subject, Class, Teacher, Account, Lesson } = require('../database/connection/');
const ResponseStatus = require('../config/message.config');
const Sequelize = require('sequelize');

class SubjectController {

    /*-----------------------------------| CREATE SUBJECT |-----------------------------------*/

    static async create(req, res) {

        try {

            const subjectInstance = await Subject.create(req.body);

            const classInstance = await Class.findAll({ where: { id: [...req.body.class] } });

            const newItems = await subjectInstance.addClasses(classInstance);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: newItems });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }
    /*-----------------------------------| READ ALL SUBJECTS |-----------------------------------*/

    static async readAll(req, res) {

        try {   
            const subjectInstance = await Subject.findAll();
            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectInstance });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ SUBJECTS OFFERED IN SCHOOL BY SID |-----------------------------------*/


    static async readSchoolSubjects(req, res) {

        const { id } = req.params;

        try {
            const subjectInstance = await Subject.findAll({ where: { SchoolManagementId: id } });


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ SINGLE SUBJECT BY ID |-----------------------------------*/

    static async readBySubjectId(req, res) {

        const { id } = req.params;

        try {

            const subjectInstance = await Subject.findByPk(id);

            if (!subjectInstance) {

                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });

            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| DELETE SUBJECT |-----------------------------------*/

    static async delete(req, res) {

        const { id } = req.params;

        try {

            const subjectInstance = await Subject.findByPk(id);

            if (!subjectInstance) {

                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });

            }

            const deletedInstance = await subjectInstance.destroy();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: deletedInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| UPDATE SUBJECT |-----------------------------------*/

    static async update(req, res) {

        try {

            const subjectInstance = await Subject.findByPk(req.body.subjectId);

            if (!subjectInstance) {

                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });

            }

            const updatedInstance = await subjectInstance.update(req.body);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: updatedInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ SUBJECT BY SUBJ-ID AND ALL THE CLASSES OFFERING SUBJECT |-----------------------------------*/


    static async readSubjectWithClasses(req, res) {

        const { id } = req.params;

        try {

            const subjectClasses = await Subject.findOne({ include: [Class], where: { id } });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectClasses });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| READ SUBJECT LESSONS |-----------------------------------*/

    static async subjectLessons(req, res) {

        const { subjectId } = req.params;

        try {

            const subjectInstance = await Subject.findByPk(subjectId);

            const lessonsInstance = await subjectInstance.getLessons();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: lessonsInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| READ SCHOOL SUBJECTS LESSONS |-----------------------------------*/

    static async schoolSubjectLessons(req, res) {

        const { id } = req.params;

        try {

            const subjectsLessons = await Subject.findAll({ include: [Lesson], where: { SchoolManagementId: id } });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subjectsLessons });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| READ SUBJECTS WITH LESSONS |-----------------------------------*/

    static async subjectsWithLessons(req, res) {

        try {

            const subjectsLessons = await Subject.findAll({ include: [Lesson] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subjectsLessons });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ SUBJECTS WITH LESSONS COUNT |-----------------------------------*/

    static async subjectsWithLessonCount(req, res) {

        try {

            const subjectsLessons = await Subject.findAll({
                include: [
                    {
                        model: Lesson,
                        attributes: [],
                    },
                ],
                attributes: {
                    include: [[Sequelize.literal('COUNT(Lessons.id)'), 'lessonCount']],
                },
                group: ['Subject.id'],
            });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subjectsLessons });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ SUBJECT BY SUBJ-ID AND ALL THE CLASSES OFFERING SUBJECT |-----------------------------------*/


    static async subjectTeachers(req, res) {

        const { id } = req.params;

        try {

            const subject = await Subject.findOne({ where: { id } });

            const teacherProfile = await subject.getTeachers();

            const teacherAccountIds = teacherProfile.map(teacher => teacher.AccountId);

            let teachersAccount = [];

            if (teacherAccountIds.length !== 0) {
                teachersAccount = await Account.findAll({ where: { id: [...teacherAccountIds] }, attributes: { exclude: ['password'] } });
            }

            const payload = {
                subject: subject,
                teachers: teachersAccount
            };

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

}

module.exports = SubjectController;