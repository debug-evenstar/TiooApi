const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define(
        "Account",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
            },
            admin: {
                type: Sequelize.STRING,
                defaultValue: "undefined",
            },
            email: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
            },
            account_type: {
                type: Sequelize.STRING,
                defaultValue: "school",
            },
            display_image: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "",
            },
            verification_status: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: "registered",
            },
            flag: {
                type: Sequelize.ENUM(
                    "active",
                    "banned",
                    "inactive",
                    "invited",
                    "registered",
                    "verified"
                ),
                defaultValue: "registered",
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        {
            indexes: [{ unique: true, fields: ["email"] }],
            timestamps: true,
            defaultScope: {
                attributes: {
                    exclude: ["updatedAt"],
                },
            },
        }
    );

    Account.beforeCreate(async (user, options) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    });

    Account.prototype.comparePassword = async function (password) {
        return bcrypt.compare(password, this.password);
    };

    Account.prototype.hashPassword = async function (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    };

    Account.beforeBulkCreate(async (users, options) => {
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
        }
    });

    Account.sync();

    return Account;
};
