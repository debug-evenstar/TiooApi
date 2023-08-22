module.exports = (sequelize, Sequelize) => {
    const TempValidation = sequelize.define("TempValidation", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: { msg: "Must be a valid Email" },
            }
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
        { 
            indexes:[
                { unique : true, fields: ['email'] }
            ],
            timestamps: false 
        },
    );

    TempValidation.beforeSave(async (validation, options) => {
        validation.expires_at = new Date(Date.now() + 3 * 60 * 1000);
    });

    TempValidation.prototype.compareExpiryDate = function () {
        const now = new Date(Date.now());
        return now > this.expires_at;
    };

    TempValidation.prototype.compareOTP = function (providedCode) {
        return this.otp === providedCode;
    };


    return TempValidation;
};