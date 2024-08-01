const { validationResult } = require("express-validator");
const ResponseStatus = require("../config/message.config");
const OnboardingQuestionModel = require("../database/onboardingQuestion.model");
const {  AccountType, OnboardingQuestion, Account } = require("../database/connection");
const ResponseMessage = require("../config/message.config");

class OnboardingController {
  static async getOnboardingQuestions(req,res){
    const questions = await OnboardingQuestion.findAll();
    return res.status(ResponseStatus.code.success).json({
      error: false,
      message: ResponseMessage.pass.read,
      data: questions,
    });
  }

  static async seedQuestions(req,res){
   await OnboardingQuestion.bulkCreate(data);
    return res.json({
      error: false,
      message: ResponseMessage.pass.added,
    });
  }

  static async saveMetaData(req,res){
    const user = req.userData;
    const answers = req.body.answers;
    const accountType = req.body.account_type;


    if(user){
      const account = await Account.findByPk(user.id);
      account.metadata = answers;
      account.onboarded = true;
      account.account_type = accountType.toLowerCase();
      await account.save();
      return res.send({
        error: false,
        message: "Saved user information"
      })
    }
    return res.send("user not found");
  }

  static async getAccountTypes(req, res) {
    const accounts = await AccountType.findAll({ include: OnboardingQuestion, order: [
      [OnboardingQuestion, 'id',"ASC"]
    ]});
    return res.status(ResponseStatus.code.success).json({
      error: false,
      message: ResponseMessage.pass.read,
      data: accounts,
    });
  }

  static async addAccountType(req, res) {
    const { name } = req.body;
    const type = await AccountType.create({
      name: name,
    });

    return res.status(ResponseStatus.code.success).json({
      error: false,
      message: ResponseMessage.pass.create,
    });
  }

  static async getAccountQuestions(req, res) {
    const { id } = req.params;
    const questions = await AccountType.findByPk(id, { include: OnboardingQuestion });
    return res.status(ResponseStatus.code.success).json({
      error: false,
      message: ResponseMessage.pass.read,
      data: questions,
    });
  }

  static async addAccountQuestion(req, res) {
    const { id } = req.params;
    const {  question, type , options } = req.body;
    const accountQuestion = await OnboardingQuestion.create({
      account_type_id: id,
      question: question,
      options: options,
      type: type,
    });


    return res.json({
      error: false,
      message: ResponseMessage.pass.create,
      data: accountQuestion
    })
  }


  static async saveOnboardingAnswers(req,res){
    return res.send(req.user);
  }
}



module.exports = OnboardingController;