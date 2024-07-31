"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable("accounts", {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: Sequelize.STRING,
                },
                email: {
                    type: Sequelize.STRING,
                },
                phone: {
                    type: Sequelize.STRING,
                },
                account_type: {
                    type: Sequelize.STRING,
                    defaultValue: "school",
                },
                display_image: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: "",
                },
                verification_status: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                },
                status: {
                    type: Sequelize.ENUM(
                        "active",
                        "banned",
                        "inactive",
                        "invited",
                        "pending"
                    ),
                    defaultValue: "pending",
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                metadata: {
                    type: Sequelize.JSON,
                    allowNull: true,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                deleted_at: {
                    type: Sequelize.DATE,
                },
            })
            .then(() =>
                queryInterface.addIndex(
                    "accounts",
                    [
                        {
                            attribute: "email",
                        },
                    ],
                    { unique: true, fields: ["email"] }
                )
            );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("accounts");
    },
};
