module.exports = (sequelize, Sequelize) => {
    const Validation = sequelize.define("Validation", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        otp: {
            type: Sequelize.STRING(6),
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        expires_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: () => new Date(Date.now() + 3 * 60 * 1000), // Set default expiration to 3 minutes from now
        },
    },
        { timestamps: false },
    );

    Validation.prototype.compareExpiryDate = function () {
        return this.expires_at > Date.now();
    };

    Validation.prototype.compareOTP = function (providedCode) {
        return this.otp === providedCode;
    };


    return Validation;
};