"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("account_textbooks", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            account_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "accounts",
                },
                onDelete: "CASCADE",
            },
            textbook_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "textbooks",
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
        await queryInterface.dropTable("account_textbooks");
    },
};
