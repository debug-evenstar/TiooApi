const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const ClassArm = sequelize.define(
        'ClassArm',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
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
