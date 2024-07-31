"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("preferences", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            account_id: {
                type: Sequelize.INTEGER,
            },
            theme: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            language: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "English (UK)",
            },
            curriculum: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Nigerian Curriculum",
            },
            first_term: {
                type: Sequelize.JSON,
                defaultValue: { starts: Sequelize.NOW, ends: Sequelize.NOW },
            },
            second_term: {
                type: Sequelize.JSON,
                defaultValue: { starts: Sequelize.NOW, ends: Sequelize.NOW },
            },
            third_term: {
                type: Sequelize.JSON,
                defaultValue: { starts: Sequelize.NOW, ends: Sequelize.NOW },
            },
            academic_duration: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: { starts: Sequelize.NOW, ends: Sequelize.NOW },
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("preferences");
    },
};
