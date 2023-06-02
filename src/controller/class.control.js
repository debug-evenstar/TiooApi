const { validationResult } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Student, Class, Subject } = require('../database/connection');
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

            const classes = await Class.findAll({ attributes: { exclude: [''], include: '' } });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classes });

        } catch (error) {
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
        /*-----------------------------------| READ CLASS WITH ALL THE OFFERED SUBJECTS |-----------------------------------*/

        static async readClassWithSubjects(req, res) {

            const { id } = req.params;
    
            try {
    
                const classSubjects = await Class.findByPk(id, { include: [Subject]});
    
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: classSubjects });
    
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


}


module.exports = ClassController;
