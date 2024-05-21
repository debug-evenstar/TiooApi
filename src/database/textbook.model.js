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
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cover_photo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            published : {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            timestamps: false,
        }
    );

    return Textbook;
};
