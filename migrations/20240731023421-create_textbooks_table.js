"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("textbooks", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            subject_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'subjects',
                    key: 'id',
                    onDelete: 'CASCADE',
                }
            },
            cover_photo: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            published: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            account_id: {
                type: Sequelize.INTEGER,
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
            deleted_at: {
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("textbooks");
    },
};
