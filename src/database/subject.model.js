const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define(
        "Subject",
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
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            exam_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                  model: 'exams',
                  key: 'id',
                }
            },
            cover: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            default: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        { timestamps: true }
    );

    return Subject;
};
