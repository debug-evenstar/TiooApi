"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("lessons", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            topic: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            duration: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "15 Minutes",
            },
            curriculum: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "none",
            },
            objective: {
                type: Sequelize.STRING,
                defaultValue: "",
                allowNull: true,
            },
            additional_instruction: {
                type: Sequelize.STRING,
                defaultValue: "",
                allowNull: true,
            },
            week: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "",
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM(
                    "ACTIVE",
                    "INACTIVE",
                    "LOCKED",
                    "UNLOCKED"
                ), // LOCKED AND UNLOCKED ARE ADMIN STATUSES
                allowNull: true,
                defaultValue: "ACTIVE",
            },
            published: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            term: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1,
            },
            chapter: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            preview: {
                type: Sequelize.JSON,
                defaultValue: [],
            },
            files: {
                type: Sequelize.JSON,
                defaultValue: [],
            },
            generated: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: "",
            },
            session_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            library: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            group_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            class_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            chapter_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            textbook_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
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
            deleted_at: {
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("lessons");
    },
};
