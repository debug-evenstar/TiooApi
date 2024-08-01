"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("cart_items", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: Sequelize.STRING,
                defaultValue: "textbook",
            },
            item: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: {},
            },
            more: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: {},
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
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("cart_items");
    },
};
