const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Keypairs = sequelize.define(
        'Keypairs',
        {
            public_key: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            private_key: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

        }, {
        timestamps: true,
    });

    return Keypairs;
};
