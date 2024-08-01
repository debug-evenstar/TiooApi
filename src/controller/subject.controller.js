const { Subject, Class, Teacher, Account, Lesson, ClassArm, SchoolManagement, LessonSlide, Topic } = require('../database/connection/');
const ResponseStatus = require('../config/message.config');
const Sequelize = require('sequelize');
const IncludeManager = require('./helper/includes');

class SubjectController {

    /*-----------------------------------| CREATE SUBJECT |-----------------------------------*/

    static async create(req, res) {

        try {

            const subjectInstance = await Subject.create(req.body);

            const classInstance = await Class.findAll({ where: { id: [...req.body.classes] } });

            let classarmInstances = [];

            if (req.body.classArms) { 
                classarmInstances = await ClassArm.findAll({ where: { id: [...req.body.classArms] } });
            }

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
                ...(req.query.default ? { where : { default : true}} : {}),
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


            const response = await Promise.all(subjectInstance.map( async (element)=>{

              const classes = await element.getClasses();
              const teachers = await element.getTeachers();
              const lessons = await element.getLessons();

              element.dataValues.class_count = classes.length;
              element.dataValues.teacher_count = teachers.length;
              element.dataValues.textbook_count = lessons.length;

              return element;

            }));

            

            // console.log(classes);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: response });

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

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: deletedInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

    /*-----------------------------------| UPDATE SUBJECT |-----------------------------------*/

    static async update(req, res) {

        try {

            const subjectId = req.body.subjectId ?? req.params.id;
            const subjectInstance = await Subject.findByPk(subjectId);

            if (!subjectInstance) {

                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });

            }

            const updatedInstance = await subjectInstance.update(req.body);

            const classInstance = await Class.findAll({ where: { id: [...req.body.classes] } });
            await subjectInstance.removeClasses();
            await subjectInstance.addClasses(classInstance);

            if (req.body.classArms) {
                const classarmInstances = await ClassArm.findAll({ where: { id: [...req.body.classArms] } });
                await subjectInstance.removeClassArms();
                await subjectInstance.addClassArms(classarmInstances);
            }



            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: updatedInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

    /*-----------------------------------| READ SUBJECT BY SUBJ-ID AND ALL THE CLASSES OFFERING SUBJECT |-----------------------------------*/


    static async readSubjectWithClasses(req, res) {

        const { id } = req.params;

        try {

            const subjectClasses = await Subject.findOne({ include: [Class, ClassArm], where: { id } });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectClasses });

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

    static async studentLessons(req, res) {

        
        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const studentAccount = await Account.findByPk(account_id);

            const studentInstance = await studentAccount.getStudent({
                include : [ClassArm, Class]
            });

            let classArmLessons = await studentInstance.ClassArm.getLessons({
                include : [ LessonSlide ]
            });

            classArmLessons = classArmLessons.filter( lesson => lesson.SubjectId == req.params.id );

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classArmLessons });

        } catch (error) {
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


    static async schoolfrontLibraryMaterial(req, res) {

        const data = req.body;

        data.library = true;

        try {

            // --------------------------------------------------------- subject

            // const accountInstance = await Account.findOne({ where: { email: ResponseStatus.tio.email } });

            const schoolInstance = await accountInstance.getSchoolManagement();

            const subjectInstance = await schoolInstance.getSubjects(
                {
                    where: { library: true }, joinTableAttributes: [],
                    include: [
                        {
                            model: Lesson,
                            attributes: { exclude: ['LibraryId'] },
                        },
                    ],
                }
            );

           const response = await Promise.all(subjectInstance.map( async (element)=>{
             const rawClasses = await element.getClasses()
             const lessonCount = element.Lessons.length

             const classes = rawClasses.map((element)=> ({ id: element.id, naming: element.naming, type: element.type }));

             delete element.dataValues.Lessons;

             return {...element.dataValues, classes: classes}
           }))

            // ------------------------------------------

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    static async getTopics(req, res) {

        try {

            const subjectId = req.params.id;

            const subjectInstance = await Subject.findByPk(subjectId);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: "Subject not found"});
            }

            const topics = await subjectInstance.getTopics();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: topics });

        } catch (error) {
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }


    static async addSubjectTopic(req, res) {

        try {

            const subjectId = req.params.id;

            const subjectInstance = await Subject.findByPk(subjectId);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: "Subject not found"});
            }

            const name = req.body.topic;

            const topicInstance = await Topic.create({ name });

            await subjectInstance.addTopic(topicInstance);

            const topics = await subjectInstance.getTopics();
            
            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: topics });

        } catch (error) {
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }


    static async deleteTopic(req, res) {

        try {

            const topicId = req.params.id;

            const topicInstance = await Topic.findByPk(topicId);

            if (!topicInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: "Topic not found"});
            }

            await topicInstance.destroy();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete });

        } catch (error) {
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

}

module.exports = SubjectController;