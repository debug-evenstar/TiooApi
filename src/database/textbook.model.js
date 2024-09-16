module.exports = (sequelize, DataTypes) => {
    const Textbook = sequelize.define(
        "Textbook",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            subject_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cover_photo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            published: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            category_id:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            is_premium: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            account_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            author: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        { timestamps: true, paranoid: true }
    );

    return Textbook;
};
