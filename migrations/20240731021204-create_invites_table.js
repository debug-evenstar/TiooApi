"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("invites", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            account_type: {
                type: Sequelize.STRING,
                defaultValue: "teacher",
            },
            teacher_type: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "subject",
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            classes: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            classarms: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            subjects: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            schoolId: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
        await queryInterface.dropTable("invites");
    },
};
