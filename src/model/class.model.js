const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define(
        'Class',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
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
