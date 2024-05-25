const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Library = sequelize.define(
        "Library",
        {
            age: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "Undefined",
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "Undefined",
            },
            file: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            category: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        { timestamps: false }
    );

    return Library;
};
