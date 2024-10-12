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
    LessonProgress,
    BookCategory,
    Shelf,
} = require("../database/connection");
const { use } = require("chai");
const AuthorizationSeed = require("../seeders/seed.authorization");
const TokenMiddleware = require("../middleware/token.middleware");
const LessonTemplateProvider = require("../providers/AI/lesson.template");
const e = require("express");
const cloudinaryUploadImage = require("../utils/cloudinary.utilities");
const AdminLibraryController = require("./admin/management/library.controller");
const ResponseMessage = require("../config/message.config");
const { data } = require("../seeders/notification.seeds");

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
        } catch (err) { }

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

            if (req.body.plan) {
                const cat = await BookCategory.update(
                    { category: req.body.plan },
                    { where: { textbook_id: id, } }
                );
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



    static async fetchTextbookStudyInfo(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.userData.id;

            if (!id) {
                return res.status(ResponseMessage.code.bad_request).json({
                    error: true,
                    message: "please provide a valid book id"
                });
            }

            const textbookInstance = await Textbook.findByPk(req.params.id, {
                include: [
                    {
                        model: Chapter,
                        as: "chapters",
                        include: [
                            {
                                model: Lesson,
                                as: "lessons",
                                include: [
                                    {
                                        model: LessonSlide,
                                        as: "lesson_slides",
                                    },
                                ],
                            },
                        ],
                    },
                    Subject,
                ],
                order: [
                    [{ model: Chapter, as: "chapters" }, "id", "ASC"],
                    [
                        { model: Chapter, as: "chapters" },
                        { model: Lesson, as: "lessons" },
                        { model: LessonSlide, as: "lesson_slides" },
                        "created_at",
                        "ASC",
                    ],
                ],
            });


            const account = await Account.findByPk(user_id, {
                include: [
                    {
                        as: 'lesson_progress',
                        model: LessonProgress
                    },
                    Shelf
                ],
            });

            const textbook = { ...textbookInstance.get({ plain: true }) }

            const inShelf = account?.Shelf?.shelf?.includes(textbookInstance.id);
            const lesson_progress = account.lesson_progress;

            const getLessonRecord = (id) => account.lesson_progress.find((i) => i.lesson_id == id);

            textbook.chapters.forEach((chapter) => {
                chapter.lessons.forEach(lesson => {
                    const record = getLessonRecord(lesson.id);
                    lesson.is_completed = record ? record.is_completed : false;
                    lesson.has_started = record ? record.slide_index != 0 : false;
                })
            })

            const response = { ...textbook, lesson_progress, inShelf };

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: response
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }



    /* ---------------------------------------------------------------------------------------------- */
    /*                                            BOOK CATEGORIES                                            */
    /* ---------------------------------------------------------------------------------------------- */

    static async getBookCategories(req, res) {
        // return await db
        const cats = await BookCategory.findAll();
        return res.send({
            error: false,
            data: cats
        });
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

    /**
     * 
     * Update the progress record of a student or user;
     *  
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async updateProgressRecord(req, res) {

        const { textbooks_id, lesson_id, slide_id, slide_index } = req.body;

        const userId = req.userData.id;

        const lessonInstance = await Lesson.findByPk(lesson_id, {
            include: [{
                model: LessonSlide,
                as: 'lesson_slides'
            }]
        });

        const record = await LessonProgress.findOne({
            where: {
                student_id: userId, textbook_id: textbooks_id, lesson_id
            }
        });
        if (record && lessonInstance) {

            if (record.dataValues.is_completed) {
                // no need to modify
                return res.status(304).json({ error: false, data: record })
            }

            if (record.dataValues.slide_index < slide_index) {
                await record.update({
                    slide_id, slide_index
                })
            }


            if (lessonInstance.lesson_slides.length == slide_index + 1) {
                await record.update({
                    is_completed: true
                })
            }

            return res.send({
                error: false,
                message: ResponseMessage.pass.create,
                data: record
            })
        }
        return res.send({
            error: true,
            message: "No record to update"
        })
    }

    static async getOrCreateProgressRecord(req, res) {
        const { textbook_id, lesson_id } = req.params;
        const userId = req.userData.id;

        const record = await LessonProgress.findOne({
            where: {
                student_id: userId, textbook_id, lesson_id
            }
        });

        if (record) {
            return res.send({
                error: false,
                data: record,
            })
        }

        // create a new one
        try {
            const progressRecord = await LessonProgress.create({
                student_id: userId, lesson_id, textbook_id
            })
            return res.send({
                error: false,
                message: ResponseMessage.pass.create,
                data: progressRecord
            })
        } catch (error) {
            console.log(error);
            return res.send({
                error: true,
                message: error.message
            })
        }
    }

}

module.exports = TextbookController;
