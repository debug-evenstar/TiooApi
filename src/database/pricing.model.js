module.exports = (sequelize, DataTypes) => {
    const Price = sequelize.define(
        'Price',
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
                defaultValue: 'exceptions',
            },
            tab: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'school',
            },
        }, {
        timestamps: false,
    });

    return Price;
};

