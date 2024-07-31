"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("schools", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            school_types: {
                type: Sequelize.TEXT,
                defaultValue: JSON.stringify(["primary", "secondary"]),
            },
            school_name: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            naming_types: {
                type: Sequelize.TEXT,
                defaultValue: "nurs-sec",
            },
            others: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            dob: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            nationality: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "Nigeria",
            },
            residential_address: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            //=========== IDENTIFICATION DOCUMENT =========//

            ssn: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            owner: {
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
            grading_system: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            establishment_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            ownership_type: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            business_registration_number: {
                type: Sequelize.STRING,
                allowNull: true,
            },
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

            proves: {
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
        await queryInterface.dropTable("schools");
    },
};
