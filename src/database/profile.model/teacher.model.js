const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Teacher = sequelize.define(
        'Teacher',
        {
            //================= PERSONAL INFORMATION=========// 

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            dateOfBirth: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            owerner_name: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: '',
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            website: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            institution_type: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'teacher',
            },
            
            //=========== BANK INFORMATION =========// 

            bank_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            account_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            account_number: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            means_of_identification: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            ids: {
                type: DataTypes.JSON,
                defaultValue: [],
            },
        }, {
        timestamps: false,
    });

    return Teacher;
};
