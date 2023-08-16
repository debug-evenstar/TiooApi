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
            dateOfBirth: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            residentialAddress: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            parent: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            class: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            school: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
