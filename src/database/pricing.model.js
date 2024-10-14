module.exports = (sequelize, DataTypes) => {
    const Price = sequelize.define(
        "Price",
        {
            teachers_price: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            student_price: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            accounts: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            tag: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "exceptions",
            },
            currency: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "NGN",
            },

            tab: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "school",
            },
            students_breakdown: {
                type: DataTypes.JSON,
                defaultValue: { quater: 0.0, half: 0.0, yearly: 0.0 },
                get() {
                    const value = this.getDataValue("students_breakdown");
                    return value ? value : {};
                },
            },
            teachers_breakdown: {
                type: DataTypes.JSON,
                defaultValue: { quater: 0.0, half: 0.0, yearly: 0.0 },
                get() {
                    const value = this.getDataValue("teachers_breakdown");
                    return value ? value : {};
                },
            },
        },
        { timestamps: false }
    );

    return Price;
};
