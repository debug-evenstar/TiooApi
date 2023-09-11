module.exports = (sequelize, DataTypes) => {
    const Preference = sequelize.define(
        'Preference',
        {
            theme: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            language: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'English (UK)',
            },
            curriculum: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Nigerian Curriculum',
            },
            first_term: {
                type: DataTypes.JSON,
                defaultValue: { "starts": DataTypes.NOW, "ends": DataTypes.NOW },
            },
            second_term: {
                type: DataTypes.JSON,
                defaultValue: { "starts": DataTypes.NOW, "ends": DataTypes.NOW },
            },
            third_term: {
                type: DataTypes.JSON,
                defaultValue: { "starts": DataTypes.NOW, "ends": DataTypes.NOW },
            },
            academic_duration: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: { "starts": DataTypes.NOW, "ends": DataTypes.NOW },
            }
        }, {
        timestamps: true,
    });

    return Preference;
};

