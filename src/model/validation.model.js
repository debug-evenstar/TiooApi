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
        expires_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: () => new Date(Date.now() + 3 * 60 * 1000), // Set default expiration to 3 minutes from now
        },
    },
        { timestamps: false },
    );

    Validation.prototype.compareExpiryDate = function (currentDate) {
        return this.expires_at > currentDate;
    };

    Validation.prototype.compareOTP = function (providedCode) {
        return this.code === providedCode;
    };


    return Validation;
};