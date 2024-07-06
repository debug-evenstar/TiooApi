const OnboardingQuestionModel = require("./onboardingQuestion.model");

module.exports = (sequelize, DataTypes) => {
    const AccountType = sequelize.define(
        "AccountType",
        {
            name: {
              type: DataTypes.STRING,
              allowNull: true,
            }            
        },
        { timestamps: true }
    );

    return AccountType;
};
