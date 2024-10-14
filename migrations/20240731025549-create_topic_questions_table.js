"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("topic_questions", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            topic_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "topics",
                },
                onDelete: "CASCADE",
            },
            question_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "questions",
                },
                onDelete: "CASCADE",
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
        await queryInterface.dropTable("topic_questions");
    },
};
