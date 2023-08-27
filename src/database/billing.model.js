const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Billing = sequelize.define(
        'Billing',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'pending',
            },

            billing_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            source: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'paystack',
            },
            coupon: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'none',
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'school',
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.00,
            },
            student_convered: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            teachers_convered: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            student_month_convered: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            teachers_month_convered: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            student_expiry: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            teacher_expiry: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        }, {
        timestamps: true,
    });

    return Billing;
};
