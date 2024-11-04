const { Account, StudyPlan } = require("../database/connection");

class StudyPlanController {

  static async createStudyPlan(req, res) {
    const { id } = req.userData;
  }

  static async updateStudyPlan(req, res) {
    const { id } = req.userData;
    const { schedule } = req.body;

    const studyplan = await StudyPlan.findOne({
      where: {
        account_id: id,
      }
    })

    if (!studyplan) {
      await StudyPlan.create({
        account_id: id,
        target_score: 0,
        data: schedule,
      })
    } else {
  
      await studyplan.update({
        data: schedule
      });
    }

    return res.status(200).json({
      error: false,
      message: "Saved schedule successfully",
      data: studyplan
    });
  }

  static async setTargetScore(req, res) {
    const { id } = req.userData;
    const { target_score } = req.body;

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
      message: "Saved schedule successfully",
      data: studyplan
    });
  }
}

module.exports = StudyPlanController;