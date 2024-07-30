const { twipsMeasureValue } = require("docx");
const AccountTypeModel = require("./accountType.model");

module.exports = (sequelize, DataTypes) => {
  const OnboardingQuestion = sequelize.define("onboarding_question", {
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        key: "id",
        model: "onboarding_questions",
      },
      onDelete: "cascade",
    },

    parent_answer: {
      allowNull: twipsMeasureValue,
      type: DataTypes.STRING,
    },

    question: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    type: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    options: {
      allowNull: true,
      type: DataTypes.TEXT,
      get(){
        const options = this.getDataValue('options');
        return JSON.parse(options);
      },
      set(value){
        this.setDataValue('options',JSON.stringify(value));
      }
    },
  }, { timestamps: false });

  return OnboardingQuestion;
};
