"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("account_coupons", {
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
            coupon_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "coupons",
                },
                onDelete: "CASCADE",
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
        await queryInterface.dropTable("account_coupons");
    },
};
