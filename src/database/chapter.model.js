const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Chapter = sequelize.define(
        "Chapter",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            index: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        { timestamps: false }
    );

    return Chapter;
};
