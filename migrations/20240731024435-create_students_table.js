"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("students", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            residential_address: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            country: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            nationality: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            student_type: {
                type: Sequelize.STRING,
                allowNull: true,
                default: "dependent",
            },

            age: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },

            parent: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            class: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            school: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            account_id: {
                type: Sequelize.INTEGER,
            },
            class_id: {
                type: Sequelize.INTEGER,
            },
            class_arm_id: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("students");
    },
};
