'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ct_profiles', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      registrationNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      otherName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telegramPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      whatsappNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parentName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parentPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      desiredCourse: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      desiredUtmeScore: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      institution: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subjectCombination: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      weakSubject: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mainChallenge: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fear: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      senderName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      referralSource: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reasonForJoining: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      birthday: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      receiptFiles: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ct_profiles');
  },
};
