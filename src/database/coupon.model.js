module.exports = (sequelize, DataTypes) => {
    const Coupon = sequelize.define(
        "Coupon",
        {
            campaign: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "Active",
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        { timestamps: true }
    );

    return Coupon;
};
