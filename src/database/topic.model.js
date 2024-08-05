const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Topic = sequelize.define(
        "Topic",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            subject_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { timestamps: true }
    );

    return Topic;
};
