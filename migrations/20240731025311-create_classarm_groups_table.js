"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("classarm_groups", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            class_arm_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "class_arms",
                },
                onDelete: "CASCADE",
            },
            group_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "groups",
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
        await queryInterface.dropTable("classarm_groups");
    },
};
