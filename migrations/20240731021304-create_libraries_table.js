"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("libraries", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 5,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "Undefined",
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "Undefined",
            },
            file: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            category: {
                type: Sequelize.INTEGER,
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
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("libraries");
    },
};
