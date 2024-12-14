const ResponseMessage = require("../config/message.config");
const { Exam, University, AccountExam, Account, StudyPlan, Subject, ExamSet, ExamSession, Textbook } = require("../database/connection");
const cloudinaryUploadImage = require("../utils/cloudinary.utilities");

class ExamsController {


  static async fetchExams(req, res) {

    const whereClause = {};
    const { type, university_id } = req.query;

    if (type) whereClause.exam_type = type;
    if (university_id) whereClause.university_id = university_id;


    const exams = await Exam.findAll({
      where: whereClause,
      include: [
        { model: Subject, required: false, as: 'subjects'},
        { model: Textbook, required: false, as: 'textbooks'}
      ]
    })

    return res.send({
      error: false,
      data: exams
    })
  }

  static async fetchExam(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userData.id;
      const exam = await Exam.findByPk(id, {
        include: [{
          model: StudyPlan,
          where: {
            account_id: user_id,
          },
          required: false,
          as: 'study_plan',
          attributes: ['target_score'],

        },
        {
          model: ExamSet,
          as: 'exam_set',
          attributes: ['id'],
          required: false,
          include: [{
            model: ExamSession,
            as: 'exam_session',
            required: false,
            where: {
              account_id: user_id,
            },
            attributes: ['id', 'account_id', 'exam_set_id', 'score'],
          }]
        },
        { model: Subject, as: 'subjects', attributes: ['name', 'id'] }
        ]
      });
      if (exam) {

        return res.send({
          error: false,
          data: exam,
        });
      }

      return res.status(404).send({
        error: true,
        message: "Exam not found",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        error: true,
        message: "Internal Server Error",
      });
    }
  }


  static async createExam(req, res) {

    if (req.file) {
      const filePath = req.file.path;
      const ImageResponse = await cloudinaryUploadImage(filePath);
      req.body.image_path = ImageResponse.secure_url;
    }

    const exam = await Exam.create(req.body);

    return res.send({
      error: false,
      data: exam
    })
  }

  static async deleteExam(req, res) {
    const { id } = req.params;
    const exam = await Exam.findByPk(id);

    if (exam) {
      await ExamSet.destroy({
        where: {
          exam_id: id
        }
      });
      await exam.destroy();

      return res.send({
        error: false,
        message: ResponseMessage.pass.delete
      });
    }

    return res.status(404).send({
      error: true,
      message: ResponseMessage.fail.not_found
    })
  }

  static async updateExam(req, res) {
    const { id } = req.params;
    const exam = await Exam.findByPk(id);


    if (exam) {
      if (req.file) {
        const filePath = req.file.path;
        const ImageResponse = await cloudinaryUploadImage(filePath);
        req.body.image_path = ImageResponse.secure_url;
      }
      await exam.update(req.body);
      return res.send({
        error: false,
        message: "Updated exam"
      });
    }

    return res.status(404).send({
      error: true,
      message: ResponseMessage.fail.not_found
    })
  }



  static async createUniversity(req, res) {

    if (req.file) {
      const filePath = req.file.path;
      const ImageResponse = await cloudinaryUploadImage(filePath);
      req.body.image_path = ImageResponse.secure_url;
    }

    const uni = await University.create(req.body);

    return res.send({
      error: false,
      data: uni
    })
  }

  static async getUniversities(req, res) {
    const exams = await University.findAll();
    return res.send({
      error: false,
      data: exams
    })
  }


  static async getUniversity(req, res) {

    const { id } = req.params;

    const uni = await University.findByPk(id, {
      include: [{ model: Exam, as: 'exams' }]
    });

    return res.send({
      error: false,
      data: uni
    })
  }


  static async deleteUniversity(req, res) {
    const { id } = req.params;
    const uni = await University.findByPk(id)
    if (uni) {
      await Exam.destroy({
        where: {
          university_id: uni.id
        }
      });
      await uni.destroy();
    }

    return res.send({
      error: false,
      message: ResponseMessage.pass.delete
    })
  }

  static async updateUniversity(req, res) {
    const { id } = req.params;

    if (req.file) {
      const filePath = req.file.path;
      const ImageResponse = await cloudinaryUploadImage(filePath);
      req.body.image_path = ImageResponse.secure_url;
    }

    const uni = await University.findByPk(id);

    if (uni) {
      await uni.update(req.body);
    }

    return res.send({
      error: false,
      data: uni
    })
  }

  static async registerExam(req, res) {
    const { exam_id } = req.params;
    const { id } = req.userData;
    const { subjects } = req.body;

    const account = await Account.findByPk(id);
    const exam = await Exam.findByPk(exam_id);
    if (account && exam) {
      await account.addExam(exam, { through: { subjects } });
      // await AccountExam.create({
      //   account_id: id, 
      //   exam_id: exam_id,
      //   subjects: subjects
      // })
      return res.send({
        error: false,
        message: "Registered Exam",
        data: account.getExams()
      })
    }

  }



  static async registerExams(req, res) {
    const { id } = req.userData;
    const { exams } = req.body;
    const account = await Account.findByPk(id);

    const examEntries = await Promise.all(
      exams?.map(async (examData) => {
        const { id: exam_id } = examData;

        const exam = await Exam.findByPk(exam_id); 1

        if (!exam) {
          return null;
        }

        return exam_id // Return the exam object

      })
    );

    const validExamEntries = examEntries?.filter((entry) => entry !== null);
    await account.addExams(validExamEntries);
    return res.send({
      error: false,
      message: "Registered Exam",
      data: await account.getExams()
    })
  }

  static async unRegisterExam(req, res) {
    const { exam_id } = req.params;
    const { id } = req.userData;

    const account = await Account.findByPk(id);
    const exam = await Exam.findByPk(exam_id);
    if (account && exam) {
      await account.removeExam(exam);
      return res.send({
        error: false,
        message: "Unregistered Exam",
      })
    }
    return res.status(404).send({
      error: true,
      message: "Resource not found",
    })
  }

  static async getAccountExams(req, res) {
    const { id } = req.userData;

    const account = await Account.findByPk(id, {
      include: ["exams"]
    })
    if (account) {
      return res.send({
        error: false,
        data: account.exams
      })
    }
    return res.status(404).send({
      error: true,
      message: "Resource not found",
    })
  }


  static async addSubjectsToExam(req, res) {

    const { exam_id } = req.params;
    const { subject_ids } = req.body;

    try {
      const exam = await Exam.findByPk(exam_id);
      if (exam) {
        await exam.setSubjects([]);
        await exam.addSubjects(subject_ids);
        return res.send({
          error: false,
          message: "Attached subjects to exam"
        });
      }

      return res.status(404).send({
        error: true,
        message: "Exam with id not found"
      });
    }
    catch (error) {
      return res.send({
        error: true,
        message: ResponseMessage.fail.server,
      });
    }


  }

  static async addTextbooksToExam(req, res) {

    const { exam_id } = req.params;
    const { textbook_ids } = req.body;

    try {
      const exam = await Exam.findByPk(exam_id);
      if (exam) {
        await exam.setTextbooks([]);
        await exam.addTextbooks(textbook_ids);
        return res.send({
          error: false,
          message: "Attached textbooks to exam"
        });
      }

      return res.status(404).send({
        error: true,
        message: "Exam with id not found"
      });
    }
    catch (error) {
      return res.status(500).send({
        error: true,
        message: error,
      });
    }


  }
}

module.exports = ExamsController;