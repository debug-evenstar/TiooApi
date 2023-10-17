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
            residential_address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            gender: {
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

            age: {
                type: DataTypes.INTEGER,
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
   
      
        }, {
        timestamps: false,
    });

    return Student;
};
