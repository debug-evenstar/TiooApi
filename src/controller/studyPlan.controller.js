const { Account, StudyPlan } = require("../database/connection");

class StudyPlanController {

  static async createStudyPlan(req, res) {
    const { id } = req.userData;
  }

  static async setTargetScore(req, res) {
    const { id } = req.userData;
    const { target_score } = req.body;

    const account = await Account.findByPk(id);
    const studyplan = await StudyPlan.findOne({
      where: {
        account_id: id,
      }
    })

    if (!studyplan) {
      await StudyPlan.create({
        account_id: id,
        target_score: target_score,
        data: {},
      })
    } else {
      studyplan.target_score = target_score;
      await studyplan.save();
    }

    return res.status(200).json({
      error: false,
      message: "Set score successfully",
      data: studyplan
    });
  }

  static async updateStudyPlan(req, res) {

  }
}

module.exports = StudyPlanController;