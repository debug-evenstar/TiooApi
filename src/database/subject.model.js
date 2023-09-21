const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define(
        'Subject',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            naming: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ages: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: [],
            },
            library: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            tab: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            library_status: {
                type: DataTypes.STRING,
                allowNull: true,
                default: ''
            },
            subject_category: {
                type: DataTypes.INTEGER,
                allowNull: true,
                
            },
            
            // status: {
            //     type: DataTypes.STRING,
            //     allowNull: true,
            // }
        }, {
        timestamps: false,
    });

    return Subject;
};
