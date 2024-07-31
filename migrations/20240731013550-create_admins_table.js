"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable("admins", {
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
                verification_status: {
                    type: Sequelize.INTEGER,
                    defaultValue: 1,
                },
                status: {
                    type: Sequelize.ENUM(
                        "active",
                        "banned",
                        "inactive",
                        "invited"
                    ),
                    defaultValue: "active",
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false,
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
                    "admins",
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
        await queryInterface.dropTable("admins");
    },
};
