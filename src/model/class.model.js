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
                defaultValue: 'nursery',
            },
            naming: {
                type: DataTypes.STRING,
                defaultValue: 'primary one',
            },
            system: {
                type: DataTypes.STRING,
                defaultValue: "pry1-6",
            },
        }, {
        timestamps: false,
    });

    return Class;
};
