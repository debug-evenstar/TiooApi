const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define(
        'Subject',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
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
