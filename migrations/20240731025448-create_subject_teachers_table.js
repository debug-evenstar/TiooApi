"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("subject_teachers", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            subject_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "subjects",
                },
                onDelete: "CASCADE",
            },
            teacher_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "teachers",
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
        await queryInterface.dropTable("subject_teachers");
    },
};
