module.exports = (sequelize, DataTypes) => {
    const Textbook = sequelize.define(
        'Textbook',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            subject: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },

        }, {
        timestamps: false,
    });

    return Textbook;
};
