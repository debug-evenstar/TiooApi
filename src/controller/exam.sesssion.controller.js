const { ExamSession, Account } = require("../database/connection");

class ExamSessionController {
  // Helper method to send responses
  static sendResponse(res, status, success, data = null, message = null) {
    return res.status(status).send({
      error: !success,
      data,
      message,
    });
  }

  // Get a specific session
  static async getSession(req, res) {
    try {
      const { set_id } = req.params;
      const { id } = req.userData;

      const session = await ExamSession.findOne({
        where: { set_id, account_id: id },
        include: [ExamSet, Account],
      });

      if (!session) {
        return ExamSessionController.sendResponse(res, 404, false, null, "Session not found");
      }

      return ExamSessionController.sendResponse(res, 200, true, session);
    } catch (error) {
      console.error(error);
      return ExamSessionController.sendResponse(res, 500, false, null, "Internal server error");
    }
  }

  // Get all sessions
  static async getAllSessions(req, res) {
    try {
      const sessions = await ExamSession.findAll({
        include: [ExamSet, Account],
      });

      if (!sessions || sessions.length === 0) {
        return ExamSessionController.sendResponse(res, 404, false, null, "No sessions found");
      }

      return ExamSessionController.sendResponse(res, 200, true, sessions);
    } catch (error) {
      console.error(error);
      return ExamSessionController.sendResponse(res, 500, false, null, "Internal server error");
    }
  }

  // Create or update a session
  static async createSession(req, res) {
    try {
      const { set_id } = req.params;
      const { id } = req.userData;
      const { score, slides, answers } = req.body;

      const [session, created] = await ExamSession.findOrCreate({
        where: { exam_set_id: set_id, account_id: id },
        defaults: { score, slides, answers },
      });

      if (!created) {
        await session.update({ score, slides, answers });
      }

      const message = created
        ? "Session created successfully"
        : "Session updated successfully";

      return ExamSessionController.sendResponse(res, 200, true, session, message);
    } catch (error) {
      console.error(error);
      return ExamSessionController.sendResponse(res, 500, false, null, "Internal server error");
    }
  }
}

module.exports = ExamSessionController;
