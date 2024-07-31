"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("classes", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: Sequelize.STRING,
                defaultValue: "Primary",
            },
            name: {
                type: Sequelize.STRING,
                defaultValue: "Primary 1",
            },
            equivalent: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            default: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            school_management_id: {
                type: Sequelize.INTEGER,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("classes");
    },
};
