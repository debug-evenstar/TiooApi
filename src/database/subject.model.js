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
        }, {
        timestamps: false,
    });

    return Subject;
};
