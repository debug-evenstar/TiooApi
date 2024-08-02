const { validationResult, body } = require("express-validator");
const ResponseStatus = require("../config/message.config");
const {
    Account,
    Validation,
    SchoolManagement,
    Class,
    ClassArm,
    Subject,
    Lesson,
} = require("../database/connection");
const AuthController = require("../controller/auth.controller");
const ClassSeeds = require("../utils/class.utilities");
const SchoolUtils = require("./helper/assignClass.helper");

class TioController {
    /*-----------------------------------| SETUP SCHOOL |-----------------------------------*/

    static async setup(req, res) {
        const tioData = {
            school_types: ["Level"],
            naming_types: "C",
            class_namings: [
                { type: "custome", name: "Grade 1", equivalent: "0" },
                { type: "custome", name: "Grade 2", equivalent: "0" },
                { type: "custome", name: "Grade 3", equivalent: "0" },
                { type: "custome", name: "Grade 4", equivalent: "0" },
                { type: "custome", name: "Grade 5", equivalent: "0" },
                { type: "custome", name: "Grade 6", equivalent: "0" },
                { type: "custome", name: "Grade 7", equivalent: "0" },
                { type: "custome", name: "Grade 8", equivalent: "0" },
                { type: "custome", name: "Grade 9", equivalent: "0" },
                { type: "custome", name: "Grade 10", equivalent: "0" },
                { type: "custome", name: "Grade 11", equivalent: "0" },
                { type: "custome", name: "Grade 12", equivalent: "0" },
            ],
        };

        const otp = Math.floor(Math.random() * 900000) + 100000;

        try {
            // GENERATE DEFAULT CLASSES

            const action = tioData.naming_types;
            const schoolChoice = tioData.school_types;
            const customClassNaming = tioData.class_namings ?? [];

            await SchoolUtils.processClassesForSchool(
                action,
                schoolChoice,
                null,
                customClassNaming
            );

            return res
                .status(ResponseStatus.code.success)
                .json({ error: false, message: ResponseStatus.pass.create });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    /*-----------------------------------| TIO AVAILABLE CLASSES |-----------------------------------*/

    static async classes(req, res) {
        try {
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
                data: ClassInstances ,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateClassName(req, res) {
        try {
            const { id } = req.params;

            const classInstace = await Class.findByPk(id);

            if (!classInstace) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            const response = await classInstace.update(req.body);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: response,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async bulkClassCreate(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res
                .status(ResponseStatus.code.bad_request)
                .json({ errors: errors.array() });
        }

        try {
            // const AccountInstance = await Account.findOne({ where: { email: ResponseStatus.tio.email } }, { include: [SchoolManagement] });

            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.no_user,
                });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();
            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            req.body.classes.map(async (data) => {
                const classInstance = await Class.create(data);
                SchoolInstances.addClass(classInstance);
            });

            return res
                .status(ResponseStatus.code.success)
                .json({ error: false, message: ResponseStatus.pass.create });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    /*-----------------------------------| TIO AVAILABLE SUBJECTS |-----------------------------------*/

    static async subjects(req, res) {
        try {
            // const AccountInstance = await Account.findOne({ where: { email: ResponseStatus.tio.email } });

            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.no_user,
                });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();

            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }
            const subjectInstance = await SchoolInstances.getSubjects({
                attributes: { exclude: ["SchoolManagementId"] },
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: subjectInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    /*-----------------------------------| TIO AVAILABLE SUBJECTS |-----------------------------------*/

    static async subjectsLessons(req, res) {
        try {
            // const AccountInstance = await Account.findOne({ where: { email: ResponseStatus.tio.email } });

            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.no_user,
                });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();

            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }
            const subjectInstance = await SchoolInstances.getSubjects({
                attributes: { exclude: ["SchoolManagementId"] },
                include: [Lesson],
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: subjectInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }
}

module.exports = TioController;
