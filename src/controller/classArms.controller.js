const { SchoolManagement, ClassArm, Class, Account, Teacher, Student, Subject } = require('../database/connection');
const ResponseStatus = require('../config/message.config');

class classArms {

    /*----------------------------------| CREATE CLASS ARMS |----------------------------------*/

    static async create(req, res) {

        const { classId, arms } = req.body;

        try {

            const classInstance = await Class.findByPk(classId);

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classArmInstance = await ClassArm.create({ naming: arms });

            await classInstance.addClassArm(classArmInstance);

            const classWithArms = await Class.findByPk(classId, { include: [ClassArm] });

            const subjectInstances = await classInstance.getSubjects();

            await Promise.all(subjectInstances.map(async (subjectInstance) => {
                
               const response =  await subjectInstance.addClassArm(classArmInstance);

                return true;
            }));

            //------- class.

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classWithArms });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

    /*----------------------------------| CREATE BULK CLASS ARMS |----------------------------------*/

    static async createBulk(req, res) {

        const { classId, arms } = req.body;

        try {

            const classInstance = await Class.findByPk(classId);

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const subjectInstances = await classInstance.getSubjects();


            for (let index = 0; index < arms.length; index++) {
                const arm = arms[index];
                const classArmInstance = await ClassArm.create({ naming: arm });
                await classInstance.addClassArm(classArmInstance);

                await Promise.all(subjectInstances.map(async (subjectInstance) => {
                    const response =  await subjectInstance.addClassArm(classArmInstance);
                     return true;
                 }));
                 
            }

           




            const classWithArms = await Class.findByPk(classId, { include: [ClassArm] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classWithArms });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

    /*----------------------------------| READ CLASS ARMS BYID |----------------------------------*/

    static async readById(req, res) {

        const { id } = req.params;

        try {

            const classArmInstance = await ClassArm.findByPk(id);

            if (!classArmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classArmInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

    /* ---------------------------- READ BY CLASS ID ---------------------------- */

    static async readAllByClass(req, res) {

        try {
            let armsResult = await ClassArm.findAll({
                where : { ClassId : req.params.id},
                include : [
                    { model : Subject },
                    { model : Student, include : [Account]},
                    { model : Teacher, include : [Account]},
                ]
            });

            if (req.userData.account_type == "teacher") {
                const teacherInstance  =  await Teacher.findOne({
                    where : {AccountId : req.userData.id},
                    include : [ClassArm]
                });

                armsResult = armsResult.filter((arm) => {
                    const teacherArmIds = teacherInstance.ClassArms.map(item => item.id);
                    return teacherArmIds.includes(arm.id);
                });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: armsResult });
        } catch (error) {
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

    /*----------------------------------| READ ALL CLASS ARMS |----------------------------------*/

    static async readAll(req, res) {

        try {

            const classArmInstance = await ClassArm.findAll();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classArmInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }


    /*----------------------------------| UPDATE CLASS ARMS BYID |----------------------------------*/

    static async updateById(req, res) {

        const { id } = req.params;

        try {

            const classArmInstance = await ClassArm.findByPk(id);

            if (!classArmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await classArmInstance.update(req.body);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

    /*----------------------------------| DELETE CLASS ARMS BYID |----------------------------------*/

    static async deleteArmById(req, res) {

        const { id } = req.params;

        try {

            const classArmInstance = await ClassArm.findByPk(id);

            if (!classArmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await classArmInstance.destroy();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }


        /*----------------------------------|  |----------------------------------*/

        static async classArmStudents(req, res) {

            const { id } = req.params;
    
            try {
    
                const classArmInstance = await ClassArm.findByPk(id);
    
                if (!classArmInstance) {
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
                }
    
                const classStudents = await classArmInstance.getStudents();

                const studentsId = classStudents.map((student) => student.AccountId);

                const classStudentsAccount = await Account.findAll({ where: { id: [...studentsId] }, attributes: { exclude: ['password'] } });    
    
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classStudentsAccount });
    
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'server error' ,  extra: error.message });
            }
        }


        static async classArmTeachers(req, res) {

            const { id } = req.params;
    
            try {
    
                const classArmInstance = await ClassArm.findByPk(id);
    
                if (!classArmInstance) {
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
                }
    
                const classTeachers = await classArmInstance.getTeachers();

                const teacherId = classTeachers.map((student) => student.AccountId);

                const classTeachersAccount = await Account.findAll({ where: { id: [...teacherId] }, attributes: { exclude: ['password'] } });    
    
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classTeachersAccount });
    
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'server error' ,  extra: error.message });
            }
        }



        static async classArmSubjects(req, res) {

            const { id } = req.params;
    
            try {
    
                const classArmInstance = await ClassArm.findByPk(id);
    
                if (!classArmInstance) {
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
                }
    
                const classSubjects = await classArmInstance.getSubjects();
   
    
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classSubjects });
    
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'server error' ,  extra: error.message });
            }
        }

            /* ---------------------------- READ BY CLASS ID ---------------------------- */

    static async classArmsByClass(req, res) {

        try {
            const classInstance = await Class.findByPk(req.query.class_id);

            const classArms = await classInstance.getClassArms();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classArms });
        } catch (error) {
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

}




module.exports = classArms;