"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("classarm_subjects", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            class_arm_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "class_arms",
                },
                onDelete: "CASCADE",
            },
            subject_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "subjects",
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
        await queryInterface.dropTable("classarm_subjects");
    },
};
