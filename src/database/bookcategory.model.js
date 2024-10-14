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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }

        },
        { timestamps: false, tableName :'book_categories' }
    );

    return BookCategory;
};
