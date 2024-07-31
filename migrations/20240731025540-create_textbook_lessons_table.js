"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("textbook_lessons", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            textbook_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "textbooks",
                },
                onDelete: "CASCADE",
            },
            lesson_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "lessons",
                },
                onDelete: "CASCADE",
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
        await queryInterface.dropTable("textbook_lessons");
    },
};
