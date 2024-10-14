const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define(
        "Group",
        {
            naming: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ref_cid: {
                type: DataTypes.INTEGER,
            },
        },
        { timestamps: false }
    );

    return Group;
};
