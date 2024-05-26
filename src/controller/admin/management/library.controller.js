const AuthController = require("../../auth.controller");
const { validationResult } = require("express-validator");
const ResponseStatus = require("../../../config/message.config");
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
} = require("../../../database/connection");
const { use } = require("chai");
const AuthorizationSeed = require("../../../seeders/seed.authorization");
const TokenMiddleware = require("../../../middleware/token.middleware");
const LessonTemplateProvider = require("../../../providers/AI/lesson.template");
const e = require("express");
const cloudinaryUploadImage = require("../../../utils/cloudinary.utilities");

class AdminLibraryController {
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
                textbook.subject_id
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

    static async fetchLessons(req, res) {
        try {
            let lessons = [];
            if (req.query.material_type == "textbook") {
                const textbook = await Textbook.findByPk(req.params.id);
                lessons = await textbook.getLessons();
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: lessons,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async createLesson(req, res) {
        try {
            let preview = [];
            if (req.files["preview"] && req.files["preview"].length > 0) {
                for (var item of req.files["preview"]) {
                    const ImageResponse = await cloudinaryUploadImage(
                        item.path
                    );
                    preview.push(ImageResponse.secure_url);
                }
            } else {
                if (req.files) {
                    const filePath = req.files[0].path;
                    const ImageResponse = await cloudinaryUploadImage(filePath);
                    preview.push(ImageResponse.secure_url);
                }
            }

            req.body.preview = preview;
            req.body.covers = [];

            const textbookInstance = await Textbook.findByPk(req.params.id);

            if (!textbookInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: false,
                    message: ResponseStatus.fail.not_found,
                    data: {},
                });
            }

            const lessonInstance = await Lesson.create(req.body);

            if (req.body.class) {
                const classInstance = await Class.findByPk(req.body.class);

                await classInstance.addLesson(lessonInstance);
            }

            if (req.body.chapter_id) {
                const chapterInstance = await Chapter.findByPk(
                    req.body.chapter_id
                );
                await chapterInstance.addLesson(lessonInstance);
            }

            await textbookInstance.addLesson(lessonInstance);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.added,
                data: lessonInstance,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateLesson(req, res) {
        try {
            let preview = [];
            if (req.files["preview"] && req.files["preview"].length > 0) {
                for (var item of req.files["preview"]) {
                    const ImageResponse = await cloudinaryUploadImage(
                        item.path
                    );
                    preview.push(ImageResponse.secure_url);
                }
            } else {
                if (req.files) {
                    const filePath = req.files[0].path;
                    const ImageResponse = await cloudinaryUploadImage(filePath);
                    preview.push(ImageResponse.secure_url);
                }
            }

            const textbookInstance = await Textbook.findByPk(req.params.id);

            if (!textbookInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: false,
                    message: ResponseStatus.fail.not_found,
                    data: {},
                });
            }

            const lessonInstance = await Lesson.findByPk(req.params.lessonid);

            req.body.preview = preview.length
                ? preview
                : lessonInstance.preview;

            await lessonInstance.update(req.body);

            if (req.body.class) {
                const previousClass = await lessonInstance.getClass();
                const classInstance = await Class.findByPk(req.body.class);
                await previousClass.removeLesson(lessonInstance);
                await classInstance.addLesson(lessonInstance);
            }

            if (req.body.chapter_id) {
                const chapterInstance = await Chapter.findByPk(
                    req.body.chapter_id
                );

                const previousChapterInstance =
                    await lessonInstance.getChapter();
                await chapterInstance.addLesson(lessonInstance);
                await previousChapterInstance.removeLesson(lessonInstance);
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: lessonInstance,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async deleteLesson(req, res) {
        const { lessonid } = req.params;

        try {
            const lessonInstance = await Lesson.findByPk(lessonid);

            if (!lessonInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            const response = await lessonInstance.destroy();

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

    static async create(req, res) {
        const data = req.body;

        if (req.file) {
            req.body.file = req.file.path;
        }

        try {
            const classInstance = await Class.findByPk(data.class);

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            const libraryInstance = await Library.create(req.body);

            // const response = await classInstance.addLibrary(libraryInstance);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: {},
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async addLibraryLesson(req, res) {
        const today = new Date();
        const threeDaysAhead = new Date();
        threeDaysAhead.setDate(today.getDate() + 3);

        if (req.file) {
            req.body.files = [req.file.path];

            console.log(req.body.files);
        }

        req.body.start_date = today;
        req.body.end_date = threeDaysAhead;

        try {
            const selectedGroup = await Group.findByPk(req.query.group_id, {
                include: [ClassArm],
            });

            const classarms = selectedGroup.ClassArms.map(
                (element) => element.id
            );

            const body = {
                topic: req.body.topic,
                duration: "45 Minutes",
                curriculum: "",
                subject: selectedGroup.SubjectId,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                objective: "",
                additioinal_instruction: "",
                week: "Week 3",
                status: "locked",
                term: req.body.term,
                class: selectedGroup.ref_cid,
                class_arms: classarms,
                files: req.body.files,
            };

            const lessonInstance = await Lesson.create(body);

            const subjectInstance = await Subject.findByPk(body.subject);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: false,
                    message: ResponseStatus.fail.not_found,
                    data: {},
                });
            }

            await subjectInstance.addLesson(lessonInstance);

            const classInstance = await Class.findByPk(body.class);

            const classarmInstances = await classInstance.getClassArms();

            const instance1 = await lessonInstance.addClassArms(
                classarmInstances
            );

            await classInstance.addLesson(lessonInstance);

            await selectedGroup.addLesson(lessonInstance);
            const instance2 = await selectedGroup.addClassArms(
                classarmInstances
            );
            const subjejctGroup = await subjectInstance.addGroup(selectedGroup);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: lessonInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async subjectGroupedLessons(req, res) {
        try {
            const subjectInstance = await Subject.findByPk(
                req.query.subject_id
            );

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: false,
                    message: "No subject found",
                    data: {},
                });
            }

            const whereClause = req.query.class_id
                ? { ClassId: req.query.class_id }
                : {};

            const lessonInstances = await subjectInstance.getLessons({
                where: whereClause,
                include: [
                    {
                        model: ClassArm,
                        attributes: ["id", "naming"],
                        through: { attributes: [] },
                    },
                    Class,
                ],
            });

            const classes = await subjectInstance.getClasses();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: lessonInstances,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async adminLibraryLessonUploadTemplate(req, res) {
        try {
            const today = new Date();
            const threeDaysAhead = new Date();
            threeDaysAhead.setDate(today.getDate() + 3);
            let filePath = "";

            let payload = {
                topic: req.body.title,
                objective: req.body.objective,
                age: req.body.age,
            };

            let covers = [];
            let preview = [];

            if (req.files) {
                payload.files = [req.files["template"][0].path];
                filePath = req.files["template"][0].path;
            }

            if (req.files["preview"].length > 0) {
                for (var item of req.files["preview"]) {
                    console.log("this is the item", item);
                    const ImageResponse = await cloudinaryUploadImage(
                        item.path
                    );
                    preview.push(ImageResponse.secure_url);
                }
            }

            payload.start_date = today;
            payload.end_date = threeDaysAhead;
            payload.covers = covers;
            payload.preview = preview;

            const lessonInstance = await Lesson.create(payload);

            const subjectInstance = await Subject.findByPk(req.body.subject);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: false,
                    message: ResponseStatus.fail.not_found,
                    data: {},
                });
            }

            const classInstance = await Class.findByPk(req.body.class);

            await classInstance.addLesson(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            const grade = `{reference:${classInstance.id},name:"${classInstance.naming}"}`;

            const subject = subjectInstance.naming;

            const slides =
                await LessonTemplateProvider.loadLessonSlidesFromTemplate(
                    filePath,
                    grade,
                    subject
                );

            const parseSlides = [];

            const previousSlides = await lessonInstance.getLessonSlides({
                orderBy: { slide_index: "asc" },
            });

            if (
                previousSlides &&
                previousSlides.length > 0 &&
                previousSlides.length > slides.data.length
            ) {
                for (
                    let i = slides.data.length;
                    i < previousSlides.length;
                    i++
                ) {
                    const slide = previousSlides[i];
                    await slide.destroy();
                }
            }

            for (let index = 0; index < slides.data.length; index++) {
                const slide = slides.data[index];
                if (previousSlides && previousSlides.length > index) {
                    const updated = previousSlides[index];
                    updated.slide_data = slide;
                    updated.save();
                } else {
                    const created = await LessonSlide.create({
                        slide_index: index,
                        slide_data: slide,
                    });
                    parseSlides.push(created);
                }
            }

            await lessonInstance.addLessonSlides(parseSlides);

            const classarmInstances = await classInstance.getClassArms();

            const instance1 = await lessonInstance.addClassArms(
                classarmInstances
            );

            /*------------------------------------------------
            Grouping Libbrary Lesson Flow
            ----------------------------------------------*/

            const group = await Group.findAll({
                include: [ClassArm],
                where: { SubjectId: req.body.subject },
            });

            let groupInstance;
            let groupId;

            const arms = classarmInstances.map((element) => element.id);

            for (let i = 0; i < group.length; i++) {
                const data = group[i].ClassArms.map((element) => element.id);

                if (arms.length == 1) {
                    if (arms[0] == data) {
                        console.log("single found", arms, data, group[i].id);
                        groupId = group[i].id;
                    } else {
                        console.log("single not found", arms, data);
                    }
                } else {
                    if (arms.every((arm) => data.includes(arm))) {
                        console.log("found", arms, data, group[i].id);
                        groupId = group[i].id;
                    } else {
                        console.log("not found", arms, data);
                    }
                }
            }

            if (groupId) {
                groupInstance = await Group.findByPk(groupId);
            } else {
                groupInstance = await Group.create({
                    naming: classInstance.naming,
                    ref_cid: classInstance.id,
                });
            }

            await groupInstance.addLesson(lessonInstance);
            const instance2 = await groupInstance.addClassArms(
                classarmInstances
            );
            const subjejctGroup = await subjectInstance.addGroup(groupInstance);

            const newlessonInstance = await Lesson.findByPk(lessonInstance.id, {
                include: [
                    {
                        model: LessonSlide,
                        orderBy: { slide_index: "asc" },
                    },
                    Subject,
                ],
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.added,
                data: newlessonInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async adminUpdateLibraryLessonUploadTemplate(req, res) {
        try {
            const today = new Date();
            const threeDaysAhead = new Date();
            threeDaysAhead.setDate(today.getDate() + 3);
            let filePath = "";

            let payload = {
                topic: req.body.title,
                objective: req.body.objective,
                age: req.body.age,
            };

            if (req.file) {
                payload.files = [req.file.path];
                filePath = req.file.path;

                console.log(payload.files);
            }

            payload.start_date = today;
            payload.end_date = threeDaysAhead;

            const lessonInstance = await Lesson.findByPk(req.body.lesson);

            const response = await lessonInstance.update(req.body);

            const grade = await lessonInstance.getClass();

            const subject = await lessonInstance.getSubject();

            const slides =
                await LessonTemplateProvider.loadLessonSlidesFromTemplate(
                    filePath,
                    grade.id,
                    subject.id
                );

            const parseSlides = [];

            const previousSlides = await lessonInstance.getLessonSlides({
                orderBy: { slide_index: "asc" },
            });

            if (
                previousSlides &&
                previousSlides.length > 0 &&
                previousSlides.length > slides.data.length
            ) {
                for (
                    let i = slides.data.length;
                    i < previousSlides.length;
                    i++
                ) {
                    const slide = previousSlides[i];
                    await slide.destroy();
                }
            }

            for (let index = 0; index < slides.data.length; index++) {
                const slide = slides.data[index];
                if (previousSlides && previousSlides.length > index) {
                    const updated = previousSlides[index];
                    updated.slide_data = slide;
                    updated.save();
                } else {
                    const created = await LessonSlide.create({
                        slide_index: index,
                        slide_data: slide,
                    });
                    parseSlides.push(created);
                }
            }

            await lessonInstance.addLessonSlides(parseSlides);

            const newlessonInstance = await Lesson.findByPk(lessonInstance.id, {
                include: [
                    {
                        model: LessonSlide,
                        orderBy: { slide_index: "asc" },
                    },
                    Subject,
                ],
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.added,
                data: newlessonInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async deleteLibraryLesson(req, res) {
        const { id } = req.params;

        try {
            const libraryLessonInstance = await Lesson.findByPk(id);

            if (!libraryLessonInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            const response = await libraryLessonInstance.destroy();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.delete,
                data: response,
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async toggleLibrarySubjectStatus(req, res) {
        const { id } = req.params;

        try {
            const libraryInstance = await Subject.findByPk(id, {
                where: { library: true },
            });

            if (!libraryInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            console.log(libraryInstance);

            libraryInstance.library_status =
                libraryInstance.library_status == "unpublished"
                    ? "published"
                    : "unpublished";

            const response = await libraryInstance.save();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: response,
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateLibraryLessonStatus(req, res) {
        const { id } = req.params;
        const data = req.query;

        try {
            const lessonInstance = await Lesson.findByPk(id);

            const response = await lessonInstance.update({
                library_status: data.status,
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: response,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateLibraryLesson(req, res) {
        try {
            const lesson = await Lesson.findByPk(req.params.id);

            if (!lesson) {
                res.status(400).json({ error: "Lesson not found" });
            }

            const lessonUpdate = await lesson.update(req.body);

            const newInstance = await Lesson.findByPk(req.params.id);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: newInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async togglePublishLibraryLesson(req, res) {
        const { id } = req.params;

        try {
            const libraryLessonInstance = await Lesson.findByPk(id);

            if (!libraryLessonInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            libraryLessonInstance.published =
                libraryLessonInstance.published == 0 ? 1 : 0;

            const response = await libraryLessonInstance.save();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: response,
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateLibraryLessonTemplate(req, res) {
        const { id } = req.params;
        const data = req.body;

        try {
            const lessonSlideInstance = await LessonSlide.findByPk(id);

            const response = await lessonSlideInstance.update({
                slide_data: data.slide_data,
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: response,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async libraryClasses(req, res) {
        const { id } = req.params;

        try {
            const libraryInstance = await Subject.findByPk(id, {
                where: { library: true },
            });

            if (!libraryInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            const response = await libraryInstance.getClasses();

            const filter = response.map((element) => ({
                id: element.id,
                naming: element.naming,
                type: element.type,
            }));

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.delete,
                data: filter,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async read(req, res) {
        try {
            const libraryInstance = await Library.findAll();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: libraryInstance,
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

module.exports = AdminLibraryController;
