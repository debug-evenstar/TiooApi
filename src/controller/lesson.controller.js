const ResponseStatus = require("../config/message.config");
const { validationResult, param } = require("express-validator");
const {
    Lesson,
    Subject,
    Chapter,
    Class,
    ClassArm,
    Group,
    LessonSlide,
    Account,
    Textbook,
    Question,
    Topic,
} = require("../database/connection");

const fs = require("fs-extra");
const path = require("path");
const Docxtemplater = require("docxtemplater");
const docx = require("docx");
const HtmlToDocx = require("html-to-docx");
const Sequelize = require("sequelize");
const LessonTemplateProvider = require("../providers/AI/lesson.template");
const AITutorProvider = require("../providers/AI/tutor");
const { equal } = require("../utils/array");
const cloudinaryUploadImage = require("../utils/cloudinary.utilities");
const { getAllFuncs } = require("../utils/objects");
const { randomString } = require("../utils/string");

class LessonController {
    /*-----------------------------------| UPLOAD LESSON |-----------------------------------*/

    static async createLesson(req, res) {
        let filePaths = [];
        const today = new Date();
        const threeDaysAhead = new Date();
        threeDaysAhead.setDate(today.getDate() + 3);

        if (req.files && req.files.length > 0) {
            filePaths = req.files.map((file) => file.path);
            req.body.files = filePaths;
        }

        if (!req.body.start_date) {
            req.body.start_date = today;
        }

        if (!req.body.end_date) {
            req.body.end_date = threeDaysAhead;
        }

        try {
            const lessonInstance = await Lesson.create(req.body);
            const subjectInstance = await Subject.findByPk(req.body.subject);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: false,
                    message: ResponseStatus.fail.not_found,
                    data: {},
                });
            }

            await subjectInstance.addLesson(lessonInstance);

            // Create a new chapter instance
            const chapter = new Chapter();
            chapter.name = "undefined";
            chapter.title = "undefined";

            const chapterInstance = await chapter.save();

            const classInstance = await Class.findByPk(req.body.class);

            const classarmInstances = await ClassArm.findAll({
                where: { id: [...JSON.parse(req.body.class_arms)] },
            });

            await subjectInstance.addChapter(chapterInstance);

            await chapterInstance.setLessons(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            const instance1 = await lessonInstance.addClassArms(
                classarmInstances
            );

            await classInstance.addLesson(lessonInstance);

            const groupInstance = await Group.create({
                naming: classInstance.naming,
                ref_cid: classInstance.id,
            });

            await groupInstance.addLesson(lessonInstance);
            const instance2 = await groupInstance.addClassArms(
                classarmInstances
            );
            const subjejctGroup = await subjectInstance.addGroup(groupInstance);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: groupInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async addLessonToGroup(req, res) {
        let filePaths = [];

        if (req.files && req.files.length > 0) {
            filePaths = req.files.map((file) => file.path);
            req.body.files = filePaths;
        }

        try {
            const lessonInstance = await Lesson.create(req.body);
            const groupInstance = await Group.findByPk(req.params.id);
            const subjectInstance = await Subject.findByPk(
                groupInstance.SubjectId
            );

            // Create a new chapter instance
            const chapter = new Chapter();
            chapter.name = "undefined";
            chapter.title = "undefined";

            const chapterInstance = await chapter.save();

            const classInstance = await Class.findByPk(groupInstance.ref_cid);
            const classArms = await groupInstance.getClassArms();

            await subjectInstance.addChapter(chapterInstance);

            await chapterInstance.setLessons(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            await groupInstance.addLesson(lessonInstance);

            await subjectInstance.addGroup(groupInstance);

            await lessonInstance.addClassArms(classArms);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: groupInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async editGroupArms(req, res) {
        try {
            const groupInstance = await Group.findByPk(req.params.id);

            const classArms = await groupInstance.getClassArms();

            await groupInstance.removeClassArms(classArms);

            const classarmInstances = await ClassArm.findAll({
                where: { id: [...req.body.class_arms] },
            });

            await groupInstance.addClassArms(classarmInstances);

            // Merge class groups if similar groups exist
            const groupArmIds = classarmInstances.map((arm) => arm.id);
            const groupSubject = await groupInstance.getSubject();
            const subjectGroups = await groupSubject.getGroups({
                include: [ClassArm],
            });

            for (let index = 0; index < subjectGroups.length; index++) {
                const group = subjectGroups[index];
                const armsIds = group.ClassArms.map((arm) => arm.id);
                if (
                    armsIds.length == groupArmIds.length &&
                    equal(armsIds, groupArmIds) &&
                    group.id !== groupInstance.id
                ) {
                    // Move all lessons to this group
                    const groupLessons = await group.getLessons();
                    for (let i = 0; i < groupLessons.length; i++) {
                        const lesson = groupLessons[i];
                        await lesson.update({
                            GroupId: groupInstance.id,
                        });
                    }
                    // Delete current group
                    await group.destroy();
                }
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: groupInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async generateLessonWithGroup(req, res) {
        const groupID = req.params.id;
        const today = new Date();
        const threeDaysAhead = new Date();
        threeDaysAhead.setDate(today.getDate() + 3);

        req.body.start_date = today;
        req.body.end_date = threeDaysAhead;

        try {
            const selectedGroup = await Group.findByPk(groupID, {
                include: [ClassArm],
            });

            const classarmsArray = selectedGroup.ClassArms.map(
                (element) => element.id
            );

            const body = {
                topic: req.body.topic,
                duration: req.body.duration ?? "45 Minutes",
                curriculum: req.body.curriculum ?? "",
                subject: selectedGroup.SubjectId,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                objective: req.body.objective,
                week: "Week 3",
                status: "locked",
                term: req.body.term,
                class: selectedGroup.ref_cid,
                class_arms: classarmsArray,
                additional_instruction: req.body.additional_instruction,
            };

            const lessonInstance = await Lesson.create(body);
            const subjectInstance = await Subject.findByPk(
                selectedGroup.SubjectId
            );

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: false,
                    message: ResponseStatus.fail.not_found,
                    data: {},
                });
            }

            await subjectInstance.addLesson(lessonInstance);

            const chapter = new Chapter();
            chapter.name = "undefined";
            chapter.title = "undefined";

            const chapterInstance = await chapter.save();

            const classInstance = await Class.findByPk(selectedGroup.ref_cid);

            const classarmInstances = await ClassArm.findAll({
                where: { id: classarmsArray },
            });

            await subjectInstance.addChapter(chapterInstance);

            await chapterInstance.setLessons(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            const instance1 = await lessonInstance.addClassArms(
                classarmInstances
            );

            await classInstance.addLesson(lessonInstance);

            await selectedGroup.addLesson(lessonInstance);
            const instance2 = await selectedGroup.addClassArms(
                classarmInstances
            );
            const subjejctGroup = await subjectInstance.addGroup(selectedGroup);

            if (req.body.resources == 1) {
                const body = {
                    topic: req.body.topic,
                    grade: classInstance.naming,
                    objectives: req.body.objective,
                    duration: req.body.duration,
                    extra: req.body.additional_instruction,
                };

                const response = await LessonTemplateProvider.getenerateLesson(
                    body
                );

                lessonInstance.generated = response.data.result;
                lessonInstance.session_id = response.data.session_id;

                await lessonInstance.save();

                response.id = lessonInstance.id;

                const fulldata = {
                    status: "success",
                    data: response.data.result,
                    session_id: response.data.session_id,
                    id: lessonInstance.id,
                };

                return res.status(ResponseStatus.code.success).json(fulldata);
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: groupInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateLesson(req, res) {
        try {
            const lesson = await Lesson.findByPk(req.params.id);

            if (!lesson) {
                res.status(400).json({ error: "Lesson not found" });
            }

            const subjectSubject = await lesson.getSubject();

            const armInstance = await lesson.getClassArms();

            const oldClassInstance = await lesson.getClass();

            const classInstance = await armInstance[0].getClass();

            if (oldClassInstance) {
                //pass
            } else {
                await classInstance.addLesson(lesson);
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

    static async subjectGroupedLessons(req, res) {
        try {
            const subjectInstance = await Subject.findByPk(
                req.query.subject_id
            );

            const whereClause = req.query.class_id
                ? { ref_cid: req.query.class_id }
                : {};

            const lessonInstances = await subjectInstance.getGroups({
                where: whereClause,
                include: [
                    {
                        model: ClassArm,
                        attributes: ["id", "naming"],
                        through: { attributes: [] },
                    },
                    Lesson,
                    Class,
                ],
            });

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

    static async addLesson(req, res) {
        let filePaths = [];
        const today = new Date();
        const threeDaysAhead = new Date();
        threeDaysAhead.setDate(today.getDate() + 3);

        if (req.files && req.files.length > 0) {
            filePaths = req.files.map((file) => file.path);
            req.body.files = filePaths;
        }

        if (!req.body.start_date) {
            req.body.start_date = today;
        }

        if (!req.body.end_date) {
            req.body.end_date = threeDaysAhead;
        }

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

            // Create a new chapter instance
            const chapter = new Chapter();
            chapter.name = "undefined";
            chapter.title = "undefined";

            const chapterInstance = await chapter.save();

            const classInstance = await Class.findByPk(body.class);

            const classarmInstances = await ClassArm.findAll({
                where: { id: [...body.class_arms] },
            });

            await subjectInstance.addChapter(chapterInstance);

            await chapterInstance.setLessons(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            const instance1 = await lessonInstance.addClassArms(
                classarmInstances
            );

            await classInstance.addLesson(lessonInstance);

            // const groupInstance = await Group.create({
            //     naming: classInstance.naming,
            //     ref_cid: classInstance.id
            // });

            await selectedGroup.addLesson(lessonInstance);
            // const instance2 = await selectedGroup.addClassArms(classarmInstances);
            // const subjejctGroup = await subjectInstance.addGroup(groupInstance);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: body,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async subjectGroups(req, res) {
        try {
            const subjectInstance = await Subject.findByPk(
                req.query.subject_id
            );

            const lessonInstances = await subjectInstance.getGroups({
                include: [
                    {
                        model: ClassArm,
                        attributes: ["id", "naming"],
                        through: { attributes: [] },
                    },
                    Class,
                ],
            });

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

    /*-----------------------------------| NEXT WEEKS LESSON |-----------------------------------*/

    static async upcomingNextWeeksLessons(req, res) {
        const { id } = req.userData;
        const account_id = req.query.account_id ? req.query.account_id : id;

        const today = new Date();
        const daysUntilNextMonday = (1 - today.getDay() + 7) % 7;
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilNextMonday);

        const daysUntilNextSunday = (7 - nextMonday.getDay()) % 7;
        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextMonday.getDate() + daysUntilNextSunday);

        try {
            const accountInstance = await Account.findByPk(account_id);

            const studentInstance = await accountInstance.getStudent();

            const classInstance = await studentInstance.getClass();

            const allLessons = await classInstance.getLessons({
                attributes: ["topic", "description", "start_date", "end_date"],
            });

            const lessonsWithinNextWeek = allLessons.filter((lesson) => {
                const lessonStartDate = new Date(lesson.start_date);
                const lessonEndDate = new Date(lesson.end_date);

                return lessonStartDate > today;
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: lessonsWithinNextWeek,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    /*-----------------------------------| NEXT WEEKS LESSON |-----------------------------------*/

    static async studentUpcomingNextWeeksLessons(req, res) {
        const today = new Date();
        const daysUntilNextMonday = (1 - today.getDay() + 7) % 7;
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilNextMonday);

        const daysUntilNextSunday = (7 - nextMonday.getDay()) % 7;
        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextMonday.getDate() + daysUntilNextSunday);

        try {
            const { id } = req.userData;

            const accountInstance = await Account.findByPk(id);

            const studentInstance = await accountInstance.getStudent();

            const classInstance = await studentInstance.getClass();

            const allLessons = await classInstance.getLessons({
                attributes: ["topic", "description", "start_date", "end_date"],
            });

            const lessonsWithinNextWeek = allLessons.filter((lesson) => {
                const lessonStartDate = new Date(lesson.start_date);
                const lessonEndDate = new Date(lesson.end_date);
                return (
                    lessonStartDate >= nextMonday &&
                    lessonStartDate <= nextSunday
                );
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: lessonsWithinNextWeek,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    /*-----------------------------------| FETCH SUBJECT LESSONS |-----------------------------------*/

    static async subjectLessons(req, res) {
        const { id } = req.params;

        try {
            const subjectInstance = await Subject.findByPk(id, {
                include: [ClassArm, Lesson, Class],
            });

            const payload = {
                id: 2,
                naming: subjectInstance.naming,
                description: subjectInstance.description,
                SchoolManagementId: subjectInstance.SchoolManagementId,
                classArms: subjectInstance.ClassArms.map((item) => ({
                    id: item.id,
                    naming: item.naming,
                    classId: item.ClassId,
                })),
                classes: subjectInstance.Classes.map((item) => ({
                    id: item.id,
                    naming: item.naming,
                })),
                lessons: subjectInstance.Lessons,
            };

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: payload,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async removeLessonFromGroup(req, res) {
        const { id } = req.params;

        try {
            const groupInstance = await Group.findByPk(id);

            const lessonInstance = await Lesson.findByPk(req.params.lesson);

            if (!lessonInstance) {
                res.status(400).json({ error: "Lesson not found" });
            }

            await groupInstance.removeLesson(lessonInstance);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.removed,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async lessonTemplate(req, res) {
        const { id } = req.params;

        try {
            const lessonInstance = await Lesson.findByPk(id, {
                include: [
                    {
                        model: LessonSlide,
                        as: "lesson_slides",
                        orderBy: { slide_index: "asc" },
                    },
                    Textbook,
                    Chapter
                ],
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: lessonInstance,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateLessonStatus(req, res) {
        const { id } = req.params;
        const data = req.query;

        try {
            const lessonInstance = await Lesson.findByPk(id);

            const response = await lessonInstance.update({
                status: data.status,
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

    static async allLessons(req, res) {
        try {
            // const lessonInstance = await Lesson.findAll();

            const lessonInstance = await Lesson.findAll({
                where: {
                    ClassId: {
                        [Sequelize.Op.not]: null,
                    },
                },
            });

            const loads = await Promise.all(
                lessonInstance.map(async (lesson) => {
                    const classInstance = await lesson.getClass();

                    const studentInstances = await classInstance.getStudents({
                        include: Account,
                    });

                    const data = {
                        lesson: lesson,
                        student: studentInstances.map((item) => ({
                            account: item.Account.id,
                            email: item.Account.email,
                        })),
                    };

                    return data;
                })
            );

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: loads,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    /*-----------------------------------| UPLOAD LESSON |-----------------------------------*/

    static async generateLesson(req, res) {
        let filePaths = [];
        const today = new Date();
        const threeDaysAhead = new Date();
        threeDaysAhead.setDate(today.getDate() + 3);

        req.body.start_date = today;
        req.body.end_date = threeDaysAhead;

        try {
            const lessonInstance = await Lesson.create(req.body);
            const subjectInstance = await Subject.findByPk(req.body.subject);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: false,
                    message: ResponseStatus.fail.not_found,
                    data: {},
                });
            }

            await subjectInstance.addLesson(lessonInstance);

            // Create a new chapter instance
            const chapter = new Chapter();
            chapter.name = "undefined";
            chapter.title = "undefined";

            const chapterInstance = await chapter.save();

            const classInstance = await Class.findByPk(req.body.class);

            const classarmInstances = await ClassArm.findAll({
                where: { id: req.body.class_arms },
            });

            await subjectInstance.addChapter(chapterInstance);

            await chapterInstance.setLessons(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            const instance1 = await lessonInstance.addClassArms(
                classarmInstances
            );

            await classInstance.addLesson(lessonInstance);

            const group = await Group.findAll({
                include: [ClassArm],
                where: { SubjectId: req.body.subject },
            });

            let groupInstance;
            let groupId;

            const arms = req.body.class_arms;

            for (let i = 0; i < group.length; i++) {
                const data = group[i].ClassArms.map((element) => element.id);

                if (arms.length == 1) {
                    if (arms[0] == data) {
                        groupId = group[i].id;
                    }
                } else {
                    if (arms.every((arm) => data.includes(arm))) {
                        groupId = group[i].id;
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

            if (req.body.resources == 1) {
                const body = {
                    topic: req.body.topic,
                    grade: classInstance.naming,
                    objectives: req.body.objective,
                    duration: req.body.duration,
                    extra: req.body.additional_instruction,
                    subject: subjectInstance.naming,
                };

                const response = await LessonTemplateProvider.getenerateLesson(
                    body
                );

                lessonInstance.generated = response.data.result;

                lessonInstance.session_id = response.data.session_id;

                await lessonInstance.save();

                response.id = lessonInstance.id;

                const fulldata = {
                    status: "success",
                    data: response.data.result,
                    session_id: response.data.session_id,
                    id: lessonInstance.id,
                };

                return res.status(ResponseStatus.code.success).json(fulldata);
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: groupInstance,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async generateLessonWithExtra(req, res) {
        const { id } = req.params;

        try {
            const lessonInstance = await Lesson.findByPk(id);

            if (!lessonInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: false,
                    message: ResponseStatus.fail.not_found,
                    data: {},
                });
            }

            const body = {
                query: req.body.query,
                session_id: req.body.session_id,
                lesson_id: lessonInstance.id,
            };

            const response =
                await LessonTemplateProvider.getenerateLessonWithExtra(body);

            lessonInstance.generated = response.data.result;

            lessonInstance.session_id = response.data.session_id;

            await lessonInstance.save();

            response.id = lessonInstance.id;

            const fulldata = {
                status: "success",
                data: response.data.result,
                session_id: response.data.session_id,
                id: lessonInstance.id,
            };

            return res.status(ResponseStatus.code.success).json(fulldata);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async readGeneratedLesson(req, res) {
        const { id } = req.params;

        try {
            const lessonInstance = await Lesson.findByPk(id);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
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
        const { id } = req.params;

        try {
            const lessonInstance = await Lesson.findByPk(id, {
                where: { library: true },
            });

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
            console.log(error);
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateGeneratedLesson(req, res) {
        const { id } = req.params;

        try {
            const lessonInstance = await Lesson.findByPk(id);

            if (req.body.generated != "") {
                const uniqueSuffix =
                    Date.now() + "-" + Math.round(Math.random() * 1e9);
                const fileName = `generated_${uniqueSuffix}.docx`;
                const absoluteFilesDirectory = path.resolve(
                    `${appRoot}/public/lessons`,
                    fileName
                );

                const docxBuffer = await HtmlToDocx(req.body.generated);

                fs.writeFileSync(absoluteFilesDirectory, docxBuffer);

                req.body.files = [`public/lessons/${fileName}`];

                const oldfile = lessonInstance.files[0];

                if (oldfile) {
                    fs.unlink(oldfile, (err) => {});
                }
            }

            const response = await lessonInstance.update(req.body);

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

    static async updateTemplateImage(req, res) {
        let payload = [];

        let filePaths = [];

        if (req.files && req.files.length > 0) {
            filePaths = req.files.map((file) => file.path);
        }

        try {
            if (filePaths.length > 0) {
                for (var item of filePaths) {
                    const ImageResponse = await cloudinaryUploadImage(item);
                    payload.push(ImageResponse.secure_url);
                }
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: payload,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async updateLessonTemplate(req, res) {
        const { id } = req.params;
        const data = req.body;

        try {
            const lessonSlideInstance = await LessonSlide.findByPk(id);

            const slide_data = await LessonController.processQuestions(
                data.slide_data
            );

            const response = await lessonSlideInstance.update({
                slide_data: slide_data,
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: response ?? [],
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async createLessonSlide(req, res) {
        const { id } = req.params;
        const data = req.body;

        try {
            const lessonInstance = await Lesson.findByPk(id, {
                include: [{ model: LessonSlide, as: "lesson_slides" }],
            });

            if (!lessonInstance) {
                return res.status(ResponseStatus.code.bad_request).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }
          
       
            const lessonSlideInstance = await LessonSlide.create({
                slide_index: data.slide_index,
                slide_data:  data.slide_data,
                lesson_id: id,
            });
              //create Questions
              const slide_data = await LessonController.processQuestions(
                data.slide_data, true,lessonSlideInstance.id
            );
          
            await lessonInstance.addLessonSlides([lessonSlideInstance]);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
                data: lessonSlideInstance,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async askAITutor(req, res) {
        const data = req.body;
        const { name, id } = req.userData;
        try {
            const lessonInstance = await Lesson.findByPk(data.lesson_id, {
                include: [
                    {
                        model: LessonSlide,
                        as: "lesson_slides",
                        orderBy: { slide_index: "asc" },
                    },
                    Textbook,
                    Chapter,
                    Class
                ],
            });

            if (!lessonInstance) {
                return res.status(ResponseStatus.code.bad_request).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                });
            }

            const response = await AITutorProvider.queryAITutor(
                lessonInstance.dataValues, data.slide_id, data.conversation, 
                { first_name : name.split(" ")[0], id }
            );

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: response.data,
            });
        } catch (error) {
            res.status(500).json({
                error: "server error",
                extra: error.message,
            });
        }
    }

    static async processQuestions(slideData, isNew = false,lessonslideId) {
        for (
            let componentIndex = 0;
            componentIndex < slideData.length;
            componentIndex++
        ) {
            const componentData = slideData[componentIndex];
            if (componentData.component == "Questions") {
                const questions = componentData.data ?? [];
                for (
                    let questionIndex = 0;
                    questionIndex < questions.length;
                    questionIndex++
                ) {
                    const question = questions[questionIndex];
                    let questionHash = question.hash;
                    let existingHash = true;
                    // Generate new hash for question if hash exists already in DB
                    while (existingHash && isNew) {
                        existingHash = await Question.findOne({
                            where: { hash: questionHash },
                        });
                        if (existingHash) {
                            questionHash = randomString(10);
                            question.hash = questionHash;
                        }
                    }
                    //include the slideid 
                    question.slide_id= lessonslideId;

                    const { title, query, hash, medi,slide_id } = question;
                    const topicIds = question.topics ?? [];
                    const topics = await Topic.findAll({
                        where: { id: topicIds },
                    });
                    if (isNew) {
                        const newQuestion = await Question.create({
                            title,
                            query,
                            hash,
                            media,

                        });
                        topics && (await newQuestion.addTopics(topics));
                    } else {
                        const existingQuestion = await Question.findOne({
                            where: { hash: questionHash },
                        });
                        if (existingQuestion) {
                            await existingQuestion.update({
                                title,
                                query,
                                media,
                            });
                            await existingQuestion.removeTopics();
                            topics && (await existingQuestion.addTopics(topics));
                        }
                    }
                    componentData.data[questionIndex] = question;
                }
                slideData[componentIndex] = componentData;
            }
        }
        return slideData;
    }
}

module.exports = LessonController;
