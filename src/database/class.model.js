const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define(
        "Class",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.STRING,
                defaultValue: "Primary",
            },
            name: {
                type: DataTypes.STRING,
                defaultValue: "Primary 1",
            },
            equivalent: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            school_management_id: {
                type: DataTypes.INTEGER,
                allowNull:true,
            },
            default: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        { timestamps: true , tableName: 'classes'}
    );

    return Class;
};
