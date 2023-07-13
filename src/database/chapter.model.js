const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Chapter = sequelize.define(
        'Chapter',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }, {
        timestamps: false,
    });

    return Chapter;
};
