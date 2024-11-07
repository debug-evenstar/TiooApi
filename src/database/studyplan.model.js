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
      target_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      data: {
        type: Sequelize.JSON,
        allowNull: false,
      },
    }, {
    timestamps: true,
  }
  );
  return StudyPlan;
}