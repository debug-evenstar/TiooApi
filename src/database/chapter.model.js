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
                allowNull: true,
                defaultValue: "Chapter 1",
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        { timestamps: false }
    );

    return Chapter;
};
