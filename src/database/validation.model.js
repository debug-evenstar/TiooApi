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

    Validation.beforeSave(async (validation, options) => {
        validation.expires_at = new Date(Date.now() + 3 * 60 * 1000);
      });

    Validation.prototype.compareExpiryDate = function () {
        const now = new Date(Date.now());
        return   now > this.expires_at;
    };

    Validation.prototype.compareOTP = function (providedCode) {
        return this.otp === providedCode;
    };


    return Validation;
};