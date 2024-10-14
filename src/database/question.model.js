const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define(
        "Question",
        {
            title: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            query: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            media: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            hash: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        { timestamps: true }
    );

    return Question;
};
