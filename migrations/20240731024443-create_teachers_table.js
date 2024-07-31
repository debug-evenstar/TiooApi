"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("teachers", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            dob: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "",
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            website: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            country: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            nationality: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            teacher_type: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "school",
            },
            institution_type: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "teacher",
            },

            //=========== BANK INFORMATION =========//

            bank_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            account_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            account_number: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            means_of_identification: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            ids: {
                type: Sequelize.JSON,
                defaultValue: [],
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
        await queryInterface.dropTable("teachers");
    },
};
