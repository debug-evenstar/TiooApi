module.exports = (sequelize, Sequelize) => {
  const StudyPlan = sequelize.define(
    "StudyPlan",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      exam_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      target_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      data: {
        type: Sequelize.JSON,
        allowNull: false,
      },

      // { subject_id: number, score: number}[]
      target_scores:{
        type: Sequelize.JSON,
        allowNull: false,
      },
      
      vision_statement:{
        type: Sequelize.STRING,
        allowNull: false,
      },


    }, {
    timestamps: true,
  }
  );
  return StudyPlan;
}