const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const Lesson = sequelize.define(
    'Lesson',
    {

      topic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '15 Minutes',
      },
      curriculum: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'none',
      },
      objective: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      additional_instruction: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      week: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Week 1',
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'unlocked',
        get() {
          const start = this.getDataValue('start_date');
          const end = this.getDataValue('end_date');
          const currentDate = new Date();
          if (start <= currentDate && currentDate <= end) {
            return 'unlocked';
          }
          return this.getDataValue('status');
      },
      },
      admin_status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'active',
      },
      published: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      term: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      files: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      library: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    },
    { timestamps: true }
  );

  return Lesson;
};
