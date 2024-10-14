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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    };

    /*-----------------------------------| FETCH ALL CLASS |-----------------------------------*/

    static async readAll(req, res) {

        try {

            // Handle fetch default classes
            if ( req.query?.default ) {
                const ClassInstances = await Class.findAll({
                    where: { default: 1 },
                });
    
                ClassInstances.sort((a, b) => {
                    const gradeA = parseInt(a.naming, 12);
                    const gradeB = parseInt(b.naming, 12);
                    return gradeA - gradeB;
                });

                return res.status(ResponseStatus.code.success).json({
                    error: false,
                    message: ResponseStatus.pass.read,
                    data: ClassInstances,
                });
            }

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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            const ClassInstances = await SchoolInstances.getClasses({ include: [
                { model : ClassArm , include : [Subject]}
            ]});

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: ClassInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }

    /*-------------------------------------| UPDATE CLASS |-------------------------------------*/

    static async update(req, res) {

        const { id } = req.params;

        try {

            const foundClass = await Class.findByPk(id);

            if (!foundClass) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await foundClass.update(req.body);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }

    /*-------------------------------------| DELETE CLASS |-------------------------------------*/

    static async delete(req, res) {

        const { id } = req.params;

        try {

            const foundClass = await Class.findByPk(id);

            if (!foundClass) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await foundClass.destroy();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: {} });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }


        /*-----------------------------------| REMOVE SUBJECT FROM CLASS |-----------------------------------*/

        static async removeSubjectFromClass(req, res) {

            const { classId, subjectId } = req.body;
    
            const { id } = req.userData;
    
            try {
    
                const classSubjects = await Class.findByPk(classId);
    
                const subjectInstance = await Subject.findByPk(subjectId);
    
                const response = await classSubjects.removeSubject(subjectInstance);

                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.removed });
    
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }


    /*-----------------------------------| CLASS STUDENTS |-----------------------------------*/

    static async classStudent(req, res) {

        const { id } = req.params;

        try {
            const classStudents = await Student.findAll({
                where : {ClassId : id},
                include : [Account, ClassArm]
            })
            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classStudents });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }

    }

    /* ------------------------- ADD TEACHER TO A CLASS ------------------------- */

    static async addTeacherToClass(req, res) {
        const errors = validationResult(req);
        const data = req.body;
        try {
            const classarmInstance = await ClassArm.findAll({where : {id : data.arms}});
            
            const classIds = classarmInstance.map(arm => arm.ClassId);

            const classInstances = await Class.findAll({ where : { id : classIds.filter((id,index) => index == classIds.indexOf(id) ) } });

            if (!classarmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const teacherInstance = await Teacher.findOne({ where: { AccountId: data.teacher_id } });

            if (!teacherInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.teacher });
            } else {

                // Class arms add teacher
                for(var i = 0; i < classarmInstance.length; i++){
                    await classarmInstance[i].addTeacher(teacherInstance);
                }

                // Class instances add teacher
                for(var i = 0; i < classInstances.length; i++){
                    await classInstances[i].addTeacher(teacherInstance);
                }

                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.added });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

    /* ---------------- GET  TEACHERS AND STUDENTS IN A CLASS --------------- */

    static async readStudentsTeachers(req, res) {

        const { id } = req.params;
        
        try {
            const classInstance = await Class.findByPk(id, { include: [Teacher, Student] });

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }
            const teacherAccountIds = classInstance.Teachers.map(teacher => teacher.AccountId);

            const studentAccountIds = classInstance.Students.map(student => student.AccountId);

            const accounts = await Account.findAll({ where: { id: [...studentAccountIds, ...teacherAccountIds] }, attributes: { exclude: ['password'] } });
            
            const mapType = (type) => accounts.filter(
                account => account.account_type == type
            );
            // const mapType = (type) => accounts.map((account) => {
            //     if (account.account_type == type) {
            //         return account;
            //     }
            // })

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, teachers: mapType("teacher"), students: mapType("student") });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

}


module.exports = ClassController;
