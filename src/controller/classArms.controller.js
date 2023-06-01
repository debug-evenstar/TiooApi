const { SchoolManagement, ClassArm, Class } = require('../database/connection');
const ResponseStatus = require('../config/message.config');

class classArms {

    /*----------------------------------| CREATE CLASS ARMS |----------------------------------*/

    static async create(req, res) {

        const { schoolId, classId, arms } = req.body;

        try {

            const schoolInstance = await SchoolManagement.findByPk(schoolId);

            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classInstance = await Class.findByPk(classId);

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classArmInstance = await ClassArm.create({ naming: arms });

            await classArmInstance.setSchoolManagement(schoolInstance);

            await classInstance.addClassArm(classArmInstance);

            const classWithArms = await Class.findByPk(classId, { include: [ClassArm] });

            //------- class.

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classWithArms });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }


    static async createBulk(req, res) {

        const { schoolId, classId, arms } = req.body;

         const armsx = JSON.parse(req.body);

        try {

            const schoolInstance = await SchoolManagement.findByPk(schoolId);

            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classInstance = await Class.findByPk(classId);

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            arms.forEach(async eachArm => {
                const classArmInstance = await ClassArm.create({ naming: eachArm });
                await classArmInstance.setSchoolManagement(schoolInstance);
                await classInstance.addClassArm(classArmInstance);
            });

            const classWithArms = await Class.findByPk(classId, { include: [ClassArm] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classWithArms });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }


}


module.exports = classArms;