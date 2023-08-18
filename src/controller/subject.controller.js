const { Subject, Class, Teacher, Account, Lesson, ClassArm, SchoolManagement } = require('../database/connection/');
const ResponseStatus = require('../config/message.config');
const Sequelize = require('sequelize');
const IncludeManager = require('./helper/includes');

class SubjectController {

    /*-----------------------------------| CREATE SUBJECT |-----------------------------------*/

    static async create(req, res) {

        try {

            const subjectInstance = await Subject.create(req.body);

            const classInstance = await Class.findAll({ where: { id: [...req.body.class] } });

            const classarmInstances = await ClassArm.findAll({ where: { id: [...req.body.classArm] } });

            const newItems = await subjectInstance.addClasses(classInstance);

            const subjectArms = await subjectInstance.addClassArms(classarmInstances);


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, subjectArms: subjectArms });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }
    /*-----------------------------------| READ ALL SUBJECTS |-----------------------------------*/

    static async readAll(req, res) {

        try {

            const subjectInstance = await Subject.findAll({
                include: IncludeManager.parseParamIncludes(req.query)
            });
            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subjectInstance });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

    /*-----------------------------------| READ SUBJECTS OFFERED IN SCHOOL BY SID |-----------------------------------*/


    static async readSchoolSubjects(req, res) {

        const { id } = req.params;

        try {
            const subjectInstance = await Subject.findAll({
                where: { SchoolManagementId: id },
                include: [ClassArm]
            });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

    /*-----------------------------------| READ SUBJECT BY SUBJ-ID AND ALL THE CLASSES OFFERING SUBJECT |-----------------------------------*/


    static async readSubjectWithClasses(req, res) {

        const { id } = req.params;

        try {

            const subjectClasses = await Subject.findOne({ include: [
                {
                    model: ClassArm,
                    attributes: ['id', 'naming', 'ClassId'],
                    through: { attributes: [] },
                },

                {
                    model: Class,
                    attributes: ['id', 'type', 'naming'],
                    through: { attributes: [] },
                },

            ], where: { id } });

            let alteredClasses = [];

            for(var i = 0; i < subjectClasses.Classes.length; i++){

                const itemClass = subjectClasses.Classes[i];

                const arms = subjectClasses.ClassArms.filter((element)=> element.ClassId === itemClass.id);

                const response = {
                    ...itemClass.dataValues, arms: arms
                }

                console.log(subjectClasses);

                alteredClasses.push(response)
            }


            const report = {
                id: subjectClasses.id,
                naming: subjectClasses.naming,
                description: subjectClasses.description,
                classes: alteredClasses
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: report });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

    /*-----------------------------------| SUBJECT CLASSES |-----------------------------------*/

    static async subjectClasses(req, res) {

        try {

            const subjects = await Subject.findByPk(req.query.subject_id);
            const classes = await subjects.getClasses();
            const cutClasses = classes.map((item) => ({ id: item.id, naming: item.naming }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: cutClasses });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

    /*-----------------------------------| READ SUBJECT LESSONS |-----------------------------------*/

    static async subjectLessons(req, res) {

        const { subjectId } = req.params;

        try {

            const subjectInstance = await Subject.findByPk(subjectId);

            const lessonsInstance = await subjectInstance.getLessons();

            if (!lessonsInstance) {
                return res.status(ResponseStatus.code.forbidden).json({ error: false, message: ResponseStatus.pass.read, data: [] });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: lessonsInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }

    /*-----------------------------------| READ SUBJECTS WITH LESSONS |-----------------------------------*/

    static async subjectsWithLessons(req, res) {

        try {

            const subjectsLessons = await Subject.findAll({ include: [Lesson] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subjectsLessons });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

    /*-----------------------------------| READ SUBJECTS WITH LESSONS COUNT |-----------------------------------*/

    static async subjectsWithLessonCount(req, res) {

        try {
            const schoolManagement = await SchoolManagement.findOne({where  : {AccountId : req.userData.id}});
            const subjectsLessons = await Subject.findAll({
                where: { SchoolManagementId: schoolManagement.id },
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }


    static async subjectStudents(req, res) {

        const { id } = req.params;

        try {

            // Will be modified later

            const subject = await Subject.findOne({ where: { id } });

            if (!subject) {
                return res.status(ResponseStatus.code.not_found).json({ error: false, message: ResponseStatus.fail.not_found, data: [] });
            }

            const classes = await subject.getClasses();

            const students = await classes[classes.length - 1].getStudents();

            // const studentsPerClass = await Promise.all(classes.map(async (classObj) => {
            //     const students = await classObj.getStudents();
            //     return students;
            //   }));

            const studentAccount = await Promise.all(students.map(async (profile) => {
                const students = await profile.getAccount({ attributes: { exclude: ['password', 'createdAt'], include: '' } });
                return students;

            }));

            const payload = { subject: subject, students: studentAccount };

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });



        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

    /* ------------------------- ADD CLASSES TO SUBJECTS ------------------------ */
    static async addClassesToSubjects(req, res) {

        try {

            const subjectInstance = await Subject.findByPk(req.body.subjectId);

            const classInstance = await Class.findAll({ where: { id: [...req.body.classes] } });

            const classarmInstances = await ClassArm.findAll({ where: { id: [...req.body.classArms] } });

            const newItems = await subjectInstance.addClasses(classInstance);

            const subjectArms = await subjectInstance.addClassArms(classarmInstances);


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, subjectArms: subjectArms });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

}

module.exports = SubjectController;