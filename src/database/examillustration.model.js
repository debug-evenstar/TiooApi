const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const ExamIllustration = sequelize.define(
    "ExamIllustrations",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject_course: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      year_semester: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      indexes: [{ unique: true, fields: ["id"] }],
      timestamps: true,
      tableName: "exam_illustrations",
      paranoid: true,
    }
  );

  return ExamIllustration;
};
