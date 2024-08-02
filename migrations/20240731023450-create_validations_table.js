"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("validations", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            account_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            admin_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            otp: {
                type: Sequelize.STRING(6),
                allowNull: true,
            },
            token: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: () => new Date(Date.now() + 30 * 60 * 1000), // Set default expiration to 3 minutes from now
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
        await queryInterface.dropTable("validations");
    },
};
