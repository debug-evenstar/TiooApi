const { validationResult } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Student, Class, Subject, Teacher, ClassArm } = require('../database/connection');
const AuthController = require('../controller/auth.controller');

class ClassController {

    /*-----------------------------------| CREATE SINGLE CLASS |-----------------------------------*/

    static async create(req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const schoolInstance = await SchoolManagement.findByPk(req.body.school_id);

            if (!schoolInstance) {

                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });

            }

            const newClass = await Class.create(req.body);

            await schoolInstance.addClass(newClass);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    };

    /*-----------------------------------| CREATE BULK CLASS |-----------------------------------*/

    static async bulkCreate(req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const schoolInstance = await SchoolManagement.findByPk(req.body[0].school_id);

            if (!schoolInstance) {

                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });

            }

            req.body.map(async (data) => {
                const classInstance = await Class.create(data);
                schoolInstance.addClass(classInstance);
            })

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    };

    /*-----------------------------------| FETCH ALL CLASS |-----------------------------------*/

    static async readAll(req, res) {

        try {

            const AccountInstance = await Account.findByPk(req.userData.id, { include: [SchoolManagement] });
            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();
            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }
            const ClassInstances = await SchoolInstances.getClasses();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: ClassInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }


    /*-----------------------------------| FETCH ALL CLASS WITH CLASS ARMS |-----------------------------------*/

    static async readAllWithArms(req, res) {

        try {

            const AccountInstance = await Account.findByPk(req.userData.id, { include: [SchoolManagement] });
            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();
            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }
            const ClassInstances = await SchoolInstances.getClasses({ include: [ClassArm] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: ClassInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| FETCH ALL CLASS WITH CLASS ARMS |-----------------------------------*/

    static async readClassWithArms(req, res) {

        const { classId } = req.params;

        try {

            const AccountInstance = await Account.findByPk(req.userData.id, { include: [SchoolManagement] });
            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();
            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }
            const ClassInstances = await SchoolInstances.getClasses({ where: { id: classId }, include: [ClassArm] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: ClassInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*----------------------------------| FETCH CLASS BY ID |----------------------------------*/

    static async read(req, res) {

        const { id } = req.params;

        try {

            const singleClass = await Class.findByPk(id);

            if (!singleClass) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: singleClass });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-------------------------------------| UPDATE CLASS |-------------------------------------*/

    static async update(req, res) {

        const { id } = req.params;

        try {

            const foundClass = await Class.findByPk(id);

            console.log(foundClass);

            if (!foundClass) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await foundClass.update(req.body);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-------------------------------------| DELETE CLASS |-------------------------------------*/

    static async delete(req, res) {

        const { id } = req.params;

        try {

            const foundClass = await Class.findByPk(id);

            console.log(foundClass);

            if (!foundClass) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await foundClass.destroy();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: {} });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| READ CLASS WITH ALL THE OFFERED SUBJECTS |-----------------------------------*/

    static async readClassWithSubjects(req, res) {

        const { id } = req.params;

        try {

            const classSubjects = await Class.findByPk(id, { include: [Subject] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classSubjects });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| ADD SUBJECT TO CLASS |-----------------------------------*/

    static async addSubjectToClass(req, res) {

        const { classId, subjectId } = req.body;

        const { id } = req.userData;

        try {

            const classSubjects = await Class.findByPk(classId);

            const subjectInstance = await Subject.findByPk(subjectId);

            const response = await classSubjects.addSubject(subjectId);

            const newClassWithSubjects = await classSubjects.getSubjects();


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.added });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| READ CLASS WITH ALL ASSIGNED TEACHERS |-----------------------------------*/

    static async readClassWithTeachers(req, res) {

        const { id } = req.params;

        try {

            const classInstance = await Class.findByPk(id, { include: [Teacher] });

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const teacherAccountIds = classInstance.Teachers.map(teacher => teacher.AccountId);

            let teachersAccount = [];

            if (teacherAccountIds.length !== 0) {
                teachersAccount = await Account.findAll({ where: { id: [...teacherAccountIds] }, attributes: { exclude: ['password'] } });
            }

            const payload = {
                id: classInstance.id,
                type: classInstance.type,
                naming: classInstance.naming,
                SchoolManagementId: classInstance.SchoolManagementId,
                Teacher: teachersAccount
            };

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| CLASS STUDENTS |-----------------------------------*/

    static async classStudent(req, res) {

        const { id } = req.params;

        try {

            const classStudents = await Class.findByPk(id, { include: [Student] });

            const studentsId = classStudents.Students.map((student) => student.AccountId);

            const classStudentsAccount = await Account.findAll({ where: { id: [...studentsId] }, attributes: { exclude: ['password'] } });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classStudentsAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /* -------------------------- ADD STUDENT TO CLASS -------------------------- */

    static async addStudentToClass(req, res) {

        const errors = validationResult(req);
        const data = req.body;
        try {
            const classarmInstance = await ClassArm.findByPk(data.arm);

            if (!classarmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }
            const classInstance = await classarmInstance.getClass();

            const studentAccountInstance = await Account.findOne({ where: { id: data.student_id } });

            if (studentAccountInstance.account_type != "student") {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.student });
            } else {

                const studentInstance = await studentAccountInstance.getStudent();

                await classInstance.addStudent(studentInstance);

                await classarmInstance.addStudent(studentInstance);

                const classStudentArray = await classInstance.getStudents({
                    where: { id: studentInstance.id }, include: { model: Account, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }
                });

                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classStudentArray });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }

    }


    /* -------------------------- REMOVE STUDENT TO CLASS -------------------------- */

    static async removeStudentFromClass(req, res) {

        const errors = validationResult(req);
        const data = req.body;
        try {
            const classarmInstance = await ClassArm.findByPk(data.arm);

            if (!classarmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }
            const classInstance = await classarmInstance.getClass();

            const studentAccountInstance = await Account.findOne({ where: { id: data.student_id } });

            if (studentAccountInstance.account_type != "student") {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.student });
            } else {

                const studentInstance = await studentAccountInstance.getStudent();

                await classInstance.removeStudent(studentInstance);

                await classarmInstance.removeStudent(studentInstance);

                const classStudentArray = await classInstance.getStudents({
                    where: { id: studentInstance.id }, include: { model: Account, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }
                });

                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classStudentArray });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }

    }

    /* ------------------------- ADD TEACHER TO A CLASS ------------------------- */

    static async addTeacherToClass(req, res) {
        const errors = validationResult(req);
        const data = req.body;
        try {
            const classarmInstance = await ClassArm.findByPk(data.arm);

            if (!classarmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }
            const classInstance = await classarmInstance.getClass();

            const teacherAccountInstance = await Account.findOne({ where: { id: data.teacher_id } });

            if (teacherAccountInstance.account_type != "teacher") {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.teacher });
            } else {

                const teacherInstance = await teacherAccountInstance.getTeacher();

                await classInstance.addTeacher(teacherInstance);

                const z = await classInstance.getTeachers();

                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.added });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }

}


module.exports = ClassController;
