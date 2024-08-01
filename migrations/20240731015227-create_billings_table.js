"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("billings", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "pending",
            },
            billing_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            source: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "paystack",
            },
            coupon: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "none",
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "school",
            },
            amount: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0.0,
            },
            student_convered: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            teachers_convered: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            student_month_convered: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
            },
            teachers_month_convered: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
            },
            student_expiry: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            teacher_expiry: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            account_id: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("billings");
    },
};
