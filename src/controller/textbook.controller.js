const AuthController = require("./auth.controller");
const { validationResult } = require("express-validator");
const ResponseStatus = require("../config/message.config");
const {
    Account,
    Authorization,
    Permission,
    Validation,
    Admin,
    SchoolManagement,
    ClassArm,
    Subject,
    Lesson,
    Class,
    Library,
    LessonSlide,
    Group,
    Textbook,
    Chapter,
} = require("../database/connection");
const { use } = require("chai");
const AuthorizationSeed = require("../seeders/seed.authorization");
const TokenMiddleware = require("../middleware/token.middleware");
const LessonTemplateProvider = require("../providers/AI/lesson.template");
const e = require("express");
const cloudinaryUploadImage = require("../utils/cloudinary.utilities");
const AdminLibraryController = require("./admin/management/library.controller");

class TextbookController {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                            TEXTBOOK                                            */
    /* ---------------------------------------------------------------------------------------------- */
    static async createLibraryTextbook(req, res) {
        const data = req.body;

        data.library = true;

        let cover = "";

        if (req.file) {
            const filePath = req.file.path;
            const ImageResponse = await cloudinaryUploadImage(filePath);
            req.body.cover_photo = ImageResponse.secure_url;
        }

        try {
            let classes = JSON.parse(req.body.classes);
            req.body.classes = classes;
        } catch (err) {}

        try {
            const classInstance = await Class.findAll({
                where: { id: [...req.body.classes] },
            });

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            const classIds = classInstance.map((element) => element.id);

            const textbookInstance = await Textbook.create(req.body);

            const subjectInstance = await Subject.findByPk(req.body.subject_id);

            await textbookInstance.addClasses(classInstance);

            await subjectInstance.addTextbook(textbookInstance);

            // ------------------------------------------

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: textbookInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateLibraryTextbook(req, res) {
        const data = req.body;

        const { id } = req.params;

        try {
            if (req.file) {
                const filePath = req.file.path;
                const ImageResponse = await cloudinaryUploadImage(filePath);
                req.body.cover_photo = ImageResponse.secure_url;
            }

            const textbook = await Textbook.findByPk(id);

            const previousSubjectInstance = await Subject.findByPk(
                textbook.SubjectId
            );

            const textbookInstance = await textbook.update(req.body);

            if (req.body.classes) {
                const classInstance = await Class.findAll({
                    where: { id: [...req.body.classes] },
                });
                const classIds = classInstance.map((element) => element.id);
                await textbookInstance.removeClasses();
                await textbookInstance.addClasses(classInstance);
            }

            if (req.body.subject_id) {
                const subjectInstance = await Subject.findByPk(
                    req.body.subject_id
                );
                await previousSubjectInstance.removeTextbook(textbookInstance);
                await subjectInstance.addTextbook(textbookInstance);
            }

            // ------------------------------------------

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: textbookInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async fetchLibraryTextbooks(req, res) {
        try {
            // --------------------------------------------------------- subject

            // const accountInstance = await Account.findOne({ where: { email: ResponseStatus.tio.email } });

            const textbookInstance = await Textbook.findAll({
                include: [{ model: Lesson }],
            });

            const response = await Promise.all(
                textbookInstance.map(async (element) => {
                    const rawClasses = await element.getClasses();
                    const lessonCount = element.Lessons.length;

                    const classes = rawClasses.map((element) => ({
                        id: element.id,
                        name: element.name,
                        type: element.type,
                    }));

                    delete element.dataValues.Lessons;

                    return { ...element.dataValues, classes, lessonCount };
                })
            );

            // ------------------------------------------

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

    static async deleteTextbook(req, res) {
        const { id } = req.params;

        try {
            const textbookInstance = await Textbook.findByPk(id);

            if (!textbookInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            const response = await textbookInstance.destroy();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.delete,
                data: response,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                                            CHAPTERS                                            */
    /* ---------------------------------------------------------------------------------------------- */

    static async fetchChapters(req, res) {
        try {
            const { id } = req.params;

            const textbookInstance = await Textbook.findByPk(id);

            if (!textbookInstance) {
                return res.status(ResponseStatus.code.bad_request).json({
                    error: true,
                    message: "Textbook not found",
                });
            }

            const chapterInstance = await textbookInstance.getChapters();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: chapterInstance,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async createChapter(req, res) {
        try {
            const { id } = req.params;

            const textbookInstance = await Textbook.findByPk(id);

            if (!textbookInstance) {
                return res.status(ResponseStatus.code.bad_request).json({
                    error: true,
                    message: "Textbook not found",
                });
            }

            const chapterInstance = await Chapter.create(req.body);

            await textbookInstance.addChapter(chapterInstance);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: chapterInstance,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateChapter(req, res) {
        try {
            const { id, chapterid } = req.params;

            const textbookInstance = await Textbook.findByPk(id);

            if (!textbookInstance) {
                return res.status(ResponseStatus.code.bad_request).json({
                    error: true,
                    message: "Textbook not found",
                });
            }

            const chapterInstance = await Chapter.findByPk(chapterid);

            await chapterInstance.update(req.body);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: chapterInstance,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async deleteChapter(req, res) {
        try {
            const { id, chapterid } = req.params;

            const textbookInstance = await Textbook.findByPk(id);

            if (!textbookInstance) {
                return res.status(ResponseStatus.code.bad_request).json({
                    error: true,
                    message: "Textbook not found",
                });
            }

            const chapterInstance = await Chapter.findByPk(chapterid);

            await chapterInstance.destroy();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.removed,
                data: chapterInstance,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                                             LESSONS                                            */
    /* ---------------------------------------------------------------------------------------------- */

    static async createTextbookLesson(req, res) {
        req.query.material_type = "textbook";
        return AdminLibraryController.createLesson(req, res);
    }

    static async fetchTextbookLessons(req, res) {
        req.query.material_type = "textbook";
        return await AdminLibraryController.fetchLessons(req, res);
    }

    static async updateTextbookLesson(req, res) {
        req.query.material_type = "textbook";
        return AdminLibraryController.updateLesson(req, res);
    }

    static async deleteTextbookLesson(req, res) {
        req.query.material_type = "textbook";
        return AdminLibraryController.deleteLesson(req, res);
    }
}

module.exports = TextbookController;
