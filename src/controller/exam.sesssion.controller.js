const { ExamSession, Account } = require("../database/connection");

class ExamSessionController {


  static async getSession(req, res) {
    const { set_id } = req.params;
    const { id } = req.userData;
    const session = await ExamSession.find({
      where: {
        set_id: set_id,
        account_id: id
      },
      include: [
        ExamSet, Account,
      ]
    });
    if (session) {
      return res.send({
        error: false,
        data: session
      });
    }

    return res.status(404).send({
      error: true,
      message: "Not found",
    })
  }

  static async getAllSessions(req, res) {
    const sessions = await ExamSession.findAll({
      include: [
        ExamSet, Account,
      ]
    });
    if (sessions) {
      return res.send({
        error: false,
        data: sessions
      });
    }

    return res.status(404).send({
      error: true,
      message: "Not found",
    })
  }



  static async createSession(req, res) {
    const { set_id } = req.params;
    const { id } = req.userData;
    const { score, slides, answers } = req.body;

    const session = await ExamSession.create({
      exam_set_id: set_id,
      account_id: id,
      score, slides, answers
    })

    return res.send({
      error: false,
      data: session,
      message: "Created session successfuly",
    });

  }
}

module.exports = ExamSessionController;