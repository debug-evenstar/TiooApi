const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const ClassArm = sequelize.define(
        'ClassArm',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            naming: {
                type: DataTypes.STRING,
                defaultValue: 'Primary 1A',
            },
        }, {
        timestamps: false,
    });

    return ClassArm;
};
