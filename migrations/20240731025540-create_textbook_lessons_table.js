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
        await queryInterface.dropTable("textbook_lessons");
    },
};
