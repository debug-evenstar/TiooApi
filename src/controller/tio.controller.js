const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Class, ClassArm, Subject, Lesson, } = require('../database/connection');
const AuthController = require('../controller/auth.controller');
const ClassSeeds = require('../utils/class.utilities');
const SchoolUtils = require('./helper/assignClass.helper');

class TioController {

    /*-----------------------------------| SETUP SCHOOL |-----------------------------------*/

    static async setup(req, res) {

        const data = {
            name: "Tio Academy",
            email:  ResponseStatus.tio.email,
            admin: "Developer",
            phone: "09083674873",
            school: "Tio Academy",
            account_type: "freelancer",
            password: "1234",
            verification_status: 1,
            status: 'active',
            flag: 'active',
        }

        const tioData = {
            email:  ResponseStatus.tio.email,
            school_types: ["Level"],
            naming_types: "C",
            class_namings: [
                { "type": "custome", "naming": "Level 1" },
                { "type": "custome", "naming": "Level 2" },
                { "type": "custome", "naming": "Level 3" },
                { "type": "custome", "naming": "Level 4" },
                { "type": "custome", "naming": "Level 5" },
                { "type": "custome", "naming": "Level 6" }
            ]
        }

        const tioArms = ["Level 1A", "Level 2A", "Level 3A", "Level 4A", "Level 5A", "Level 6A"];

        const tioSubjeects = [
            { name1: 'Level 1 General Subject 1', desc1: 'level 1 Subject Description 1', name2: 'Level 1 General Subject 2', desc2: 'level 1 Subject Description 2' },
            { name1: 'Level 2 General Subject 1', desc1: 'level 2 Subject Description 1', name2: 'Level 2 General Subject 2', desc2: 'level 2 Subject Description 2' },
            { name1: 'Level 3 General Subject 1', desc1: 'level 3 Subject Description 1', name2: 'Level 3 General Subject 2', desc2: 'level 3 Subject Description 2' },
            { name1: 'Level 4 General Subject 1', desc1: 'level 4 Subject Description 1', name2: 'Level 4 General Subject 2', desc2: 'level 4 Subject Description 2' },
            { name1: 'Level 5 General Subject 1', desc1: 'level 5 Subject Description 1', name2: 'Level 5 General Subject 2', desc2: 'level 5 Subject Description 2' },
            { name1: 'Level 6 General Subject 1', desc1: 'level 6 Subject Description 1', name2: 'Level 6 General Subject 2', desc2: 'level 6 Subject Description 2' },
        ]

        const otp = Math.floor(Math.random() * 900000) + 100000;

        try {

            const checkSetup = await Account.findOne({ where: { email: data.email } });

            if (checkSetup) {
                return res.status(ResponseStatus.code.conflict).json({
                    error: true, message:
                        ResponseStatus.fail.school_duplicate
                });
            }

            //SETUP ACCOUNT WITH VALIDATION

            const tioAccount = await Account.create(data);
            const tioValidation = await Validation.create({ otp });
            const response = await tioAccount.setValidation(tioValidation);


            //SETUP SCHOOL AND BIND ACCOUNT

            const tioSchoolManagement = await SchoolManagement.create({
                school_name: data.school,
                school_types: '["Custome"]',
                naming_types: 'C'
            });

            await tioAccount.setSchoolManagement(tioSchoolManagement);

            // GENERATE CLASSES FOR SETUP SCHOOL

            const action = tioData.naming_types;
            const schoolChoice = tioData.school_types;
            const schoolId = tioSchoolManagement.dataValues.id;
            const customClassNaming = tioData.class_namings ?? [];

            await SchoolUtils.processClassesForSchool(action, schoolChoice, schoolId, customClassNaming);

            const updatedTioSchool = await SchoolManagement.findOne({ where: { AccountId: tioAccount.id }, include: [Class] });


            if (updatedTioSchool) {

                 // GENERATE CLASSES ARMS FOR EACH CLASSESS

                const classes = updatedTioSchool.Classes;
                let generatedClassArms = [];

                for (let i = 0; i < classes.length; i++) {
                    const tioClass = classes[i];
                    const classArmName = tioArms[i];

                    const classInstance = await Class.findByPk(tioClass.id);
                    const classArmInstance = await ClassArm.create({ naming: classArmName });

                    generatedClassArms.push(classArmInstance.id)

                    await classInstance.addClassArm(classArmInstance);

                }

                 // GENERATE SUBJECTS

                for (let index = 0; index < tioSubjeects.length; index++) {



                    const subjectInstance1 = await Subject.create({ naming: tioSubjeects[index].name1, description: tioSubjeects[index].desc1 });
                    const subjectInstance2 = await Subject.create({ naming: tioSubjeects[index].name2, description: tioSubjeects[index].desc2 });

                    await tioSchoolManagement.addSubject(subjectInstance1);
                    await tioSchoolManagement.addSubject(subjectInstance2);

                    const classInstance = await Class.findAll({ where: { id: [classes[index].id] } });
                    const classarmInstances = await ClassArm.findAll({ where: { id: [generatedClassArms[index]] } });
                    const newItems = await subjectInstance1.addClasses(classInstance);
                    const subjectArms = await subjectInstance2.addClassArms(classarmInstances);

                }

            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: updatedTioSchool });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    };



    /*-----------------------------------| TIO AVAILABLE CLASSES |-----------------------------------*/

    static async classes(req, res) {

        try {

            const AccountInstance = await Account.findOne({ where: { email: ResponseStatus.tio.email } }, { include: [SchoolManagement] });

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



    /*-----------------------------------| TIO AVAILABLE SUBJECTS |-----------------------------------*/

    static async subjects(req, res) {

        try {

            const AccountInstance = await Account.findOne({ where: { email:  ResponseStatus.tio.email } });

            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();

            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }
            const subjectInstance = await SchoolInstances.getSubjects({ attributes: { exclude: ['SchoolManagementId'] }});

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subjectInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }


      /*-----------------------------------| TIO AVAILABLE SUBJECTS |-----------------------------------*/

      static async subjectsLessons(req, res) {

        try {

            const AccountInstance = await Account.findOne({ where: { email:  ResponseStatus.tio.email } });

            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();

            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }
            const subjectInstance = await SchoolInstances.getSubjects({ attributes: { exclude: ['SchoolManagementId'] }, include: [Lesson]});

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subjectInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }


}


module.exports = TioController;
