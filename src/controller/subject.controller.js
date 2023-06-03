const { Subject, Class } = require('../database/connection/');
const ResponseStatus = require('../config/message.config');

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


    static async readBySchoolId(req, res) {

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

}

module.exports = SubjectController;