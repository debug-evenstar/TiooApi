const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define(
        'Class',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.STRING,
                defaultValue: 'Primary',
            },
            naming: {
                type: DataTypes.STRING,
                defaultValue: 'Primary 1',
            },
        }, {
        timestamps: false,
    });

    return Class;
};
