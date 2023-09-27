module.exports = (sequelize, DataTypes) => {
    const Textbook = sequelize.define(
        'Textbook',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            subject_pair: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            grades: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: [],
            },

        }, {
        timestamps: false,
    });

    return Textbook;
};
