// import { Textbook } from "../database/connection";
const { Op } = require("sequelize");
const {
  Textbook,
  Account,
  Shelf,
  Chapter,
  Subject,
  Lesson,
  LessonSlide,
  Class,
  BookCategory,
} = require("../database/connection");
const ResponseStatus = require("../config/message.config");
const cloudinaryUploadImage = require("../utils/cloudinary.utilities");

class LibraryController {
  static async getLibraryTextbooks(req, res) {
    const { id } = req.userData;
    const textbooks = await Textbook.findAll({
      where: {
        published: 1,
      },
      include: BookCategory
    });

    const account = await Account.findByPk(id, {
      include: Shelf,
    });

    let response = textbooks;

    if (!account.Shelf) {
      // create a shelf for the user
      await account.createShelf({
        account_id: id,
        shelf: [],
      });
      await account.reload();
    }

    response = textbooks.map((textbook) => {
      const inShelf = account.Shelf?.shelf?.includes(textbook.id);
      return {
        ...textbook.get({ plain: true }),
        inShelf,
      };
    });

    return res.send({
      error: false,
      data: response,
    });
  }

  async getStudentTextbooks() {}

  static async getStudentShelf(req, res) {
    const { id } = req.userData;
    const account = await Account.findByPk(id, {
      include: Shelf,
    });

    if (account.Shelf) {
      const books = await Textbook.findAll({  
        where: {
          id: account.Shelf?.shelf ?? [],
        },
      });

      return res.send({
        error: false,
        data: books,
      });
    }

    return res.send({
      error: false,
      data: [],
    });
  }

  static async removeTextbookFromShelf(req, res) {
    const { id } = req.userData;
    const { textbook_id } = req.body;
    const account = await Account.findByPk(id, {
      include: Shelf,
    });

    await account.Shelf.update({
      shelf: account.Shelf.shelf.filter((id) => id != textbook_id),
    });

    return res.send({
      error: false,
      message: "Removed textbook from shelf",
    });
  }

  static async addTextbookToShelf(req, res) {
    const { id } = req.userData;
    const { textbook_id } = req.body;

    const account = await Account.findByPk(id, {
      include: Shelf,
    });

    if (!account.Shelf) {
      // create a shelf for the user
      const shelf = await account.createShelf({
        account_id: id,
        shelf: [textbook_id],
      });
    } else {
      await account.Shelf.update({
        shelf: [...new Set([...account.Shelf.shelf, textbook_id])],
      });
    }

    // const textbook = await Textbook.findByPk(textbook_id);
    return res.send({
      error: false,
      message: ResponseStatus.pass.sucess,
    });
  }

  static async getLibraryTextbook(req, res) {
    try {
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
          [
            { model: Chapter, as: "chapters" },
            { model: Lesson, as: "lessons" },
            { model: LessonSlide, as: "lesson_slides" },
            "slide_index",
            "ASC",
          ],
        ],
      });

      // ------------------------------------------

      return res.status(ResponseStatus.code.success).json({
        error: false,
        message: ResponseStatus.pass.read,
        data: textbookInstance,
      });
    } catch (error) {
      res.status(500).json({
        error: "server error",
        extra: error.message,
      });
    }
  }

  // async getStudentTextbooks(){

  // }

  static async createLibraryTextbook(req, res) {
    const data = req.body;
    const account = await Account.findByPk(req.userData.id);
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

      await account.addTextbook(textbookInstance);

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
        const subjectInstance = await Subject.findByPk(req.body.subject_id);
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
      // Admin case
      // const textbookInstance = await Textbook.findAll({
      //     include: [{ model: Lesson }],
      // });

      const textbookInstance = await Textbook.findAll({
        where: { account_id: req.userData.id },
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

  static async togglePublishLibraryTextbook(req, res) {
    const { id } = req.params;

    try {
      const textbookInstance = await Textbook.findByPk(id);

      if (!textbookInstance) {
        return res.status(ResponseStatus.code.not_found).json({
          error: true,
          message: ResponseStatus.fail.not_found,
        });
      }

      textbookInstance.published = textbookInstance.published == 0 ? 1 : 0;

      const response = await textbookInstance.save();

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
}

module.exports = LibraryController;
