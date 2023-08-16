const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const ErrorLog = sequelize.define(
        'ErrorLog',
        {
            //================= PERSONAL INFORMATION=========// 

            error_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            error_description: {
                type: DataTypes.STRING
            },
            route: {
                type: DataTypes.STRING,
                allowNull: false
            },
            method: {
                type: DataTypes.STRING,
                allowNull: false
            },
            error_code: {
                type: DataTypes.STRING,
                allowNull: false
            },
        }, {
        timestamps: false,
    });

    return ErrorLog;
};
