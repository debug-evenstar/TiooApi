module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define(
        'CartItem',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.STRING,
                defaultValue: 'textbook',
            },
            item: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: {},
            },
            more: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: {},
            },
        }, {
        timestamps: false,
    });

    return CartItem;
};
