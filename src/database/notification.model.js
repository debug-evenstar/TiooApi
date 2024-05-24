const bcrypt = require("bcrypt");
const NotificatinSeed = require("../seeders/notification.seeds");

module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define(
        "Notification",
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "",
            },
            caption: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "",
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "school",
            },
        },
        { timestamps: false }
    );

    Notification.seedIfEmpty = async () => {
        const count = await Notification.count();
        if (count === 0) {
            await Notification.bulkCreate(NotificatinSeed.data);
        }
    };

    Notification.sync().then(() => {
        Notification.seedIfEmpty();
    });

    return Notification;
};
