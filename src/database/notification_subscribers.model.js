const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define(
        "Subscription",
        {
            device_id: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "",
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        { timestamps: false }
    );

    return Subscription;
};
