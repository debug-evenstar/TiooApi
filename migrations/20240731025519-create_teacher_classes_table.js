"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("teacher_classes", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            teacher_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "teachers",
                },
                onDelete: "CASCADE",
            },
            class_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "classes",
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
        await queryInterface.dropTable("teacher_classes");
    },
};
