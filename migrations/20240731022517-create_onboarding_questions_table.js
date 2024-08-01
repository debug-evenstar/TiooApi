"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("onboarding_questions", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            parent_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    key: "id",
                    model: "onboarding_questions",
                },
                onDelete: "CASCADE",
            },

            parent_answer: {
                allowNull: true,
                type: Sequelize.STRING,
            },

            question: {
                allowNull: false,
                type: Sequelize.STRING,
            },

            type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            options: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("onboarding_questions");
    },
};
