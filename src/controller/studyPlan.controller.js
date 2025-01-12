const { Account, StudyPlan } = require("../database/connection");

class StudyPlanController {

  static async createStudyPlan(req, res) {
    const { id } = req.userData;
  }

  static async updateStudyPlan(req, res) {
    const { id } = req.userData;
    const { schedule, exam_id } = req.body;

    let studyplan = await StudyPlan.findOne({
      where: {
        account_id: id,
        exam_id: exam_id,
      }
    })

    if (!studyplan) {
      studyplan = await StudyPlan.create({
        account_id: id,
        target_score: 0,
        exam_id: exam_id,
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

  static async getStudyPlans(req, res) {
    const { id } = req.userData;
    // const { exam_id } = req.params;

    const records = await StudyPlan.findAll({
      where: {
        account_id: id,
        // exam_id: exam_id,
      }
    })

    return res.send({
      error: false,
      data: records
    })
  }

  static async setTargetScore(req, res) {
    const { id } = req.userData;
    const { target_score, exam_id, target_scores, vision_statement } = req.body;
    const studyplan = await StudyPlan.findOne({
      where: {
        account_id: id,
        exam_id: exam_id,
      }
    })

    if (!studyplan) {
      await StudyPlan.create({
        account_id: id,
        exam_id: exam_id,
        target_score: target_score,
        target_scores: target_scores,
        data: [],
        vision_statement,
      })
    } else {
      studyplan.target_score = target_score;
      studyplan.target_scores = target_scores;
      studyplan.vision_statement = vision_statement;
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