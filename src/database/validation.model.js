const { MD5 } = require("crypto-js");

module.exports = (sequelize, Sequelize) => {
    const Validation = sequelize.define(
        "Validation",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            account_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            admin_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            otp: {
                type: Sequelize.STRING(6),
                allowNull: true,
            },
            token: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            // createdAt: {
            //     type: Sequelize.DATE,
            //     allowNull: false,
            //     defaultValue: Sequelize.NOW,
            // },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: () => new Date(Date.now() + 30 * 60 * 1000), // Set default expiration to 3 minutes from now
            },
        },
        { timestamps: true }
    );

    // Validation.beforeSave(async (validation, options) => {
    //     validation.expires_at = new Date(Date.now() + 3 * 60 * 1000);
    //   });

    Validation.prototype.compareExpiryDate = function () {
        const now = new Date(Date.now());
        return now > this.expires_at;
    };

    Validation.prototype.compareOTP = function (providedCode) {
        return this.otp === providedCode;
    };

    Validation.prototype.isTokenValid = function (token) {
        console.log(this.expires_at);
        const hash = MD5(this.accountId + this.expires_at).toString();
        return hash === token;
    };

    return Validation;
};
