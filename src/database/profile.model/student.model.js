const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define(
        'Student',
        {

            //================= PERSONAL INFORMATION=========// 

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dateOfBirth: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            residentialAddress: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },

            //=========== IDENTIFICATION DOCUMENT =========// 

            passportNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }, {
        timestamps: false,
    });

    return Student;
};
