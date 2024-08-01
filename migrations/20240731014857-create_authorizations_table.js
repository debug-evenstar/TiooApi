"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("authorizations", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                default: "admin",
            },
            position: {
                type: Sequelize.STRING,
                allowNull: false,
                default: "Developer",
            },
            permissions: {
                type: Sequelize.JSON,
                defaultValue: [],
            },
            account_id: {
                type: Sequelize.INTEGER,
            },
            admin_id: {
                type: Sequelize.INTEGER,
            },
            school_management_id: {
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
        await queryInterface.dropTable("authorizations");
    },
};
