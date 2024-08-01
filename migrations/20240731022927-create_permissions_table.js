"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable("permissions", {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                code: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                account: {
                    type: Sequelize.STRING,
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
            })
            .then(() =>
                queryInterface.addIndex(
                    "permissions",
                    [
                        {
                            attribute: "name",
                        },
                    ],
                    { unique: true, fields: ["name"] }
                )
            );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("permissions");
    },
};
