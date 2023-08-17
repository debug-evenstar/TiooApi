const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const TotalLog = sequelize.define(
        'TotalLog',
        {
            responseBody: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Undefined',
            },
            params: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Undefined',
            },
            query: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Undefined',
            },
            method: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Undefined'
            },
            statuscode: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Undefined'
            },
            url: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Undefined'
            },
            body: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Undefined'
            },
            originalUrl: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Undefined'
            }
        }, {
        timestamps: true,
    });

    return TotalLog;
};
