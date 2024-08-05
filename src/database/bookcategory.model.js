const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const BookCategory = sequelize.define(
        "BookCategory",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            textbook_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { timestamps: true, tableName :'book_category' }
    );

    return BookCategory;
};
