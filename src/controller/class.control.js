const { validationResult } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Student, Class } = require('../model/database');
const AuthController = require('../controller/auth.controller');

class ClassController {

    /*-----------------------------------| CREATE SINGLE CLASS |-----------------------------------*/

    static async create(req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const [newClass] = await Class.findOrCreate({ where: req.body });

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

            req.body.map(async (data) => { await Class.findOrCreate({ where: data }) })

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

        const {id} = req.params;

        try {

            const singleClass = await Class.findByPk(id);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: singleClass });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-------------------------------------| UPDATE CLASS |-------------------------------------*/


    /*-------------------------------------| DELETE CLASS |-------------------------------------*/


    /*----------------------------------| FETCH CLASSES BY SCH-ID |----------------------------------*/

}


module.exports = ClassController;
