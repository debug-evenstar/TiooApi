const bcrypt = require("bcrypt");
const HashUtils = require("../utils/hash.utilities");

module.exports = (sequelize, DataTypes) => {
    const Keypairs = sequelize.define(
        "Keypairs",
        {
            public_key: {
                type: DataTypes.TEXT,
                allowNull: true,
                // defaultValue:
            },
            private_key: {
                type: DataTypes.TEXT,
                allowNull: true,
                // defaultValue:
            },
        },
        { timestamps: true }
    );

    return Keypairs;
};
