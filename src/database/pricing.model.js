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

            students_breakdown: {
                type: DataTypes.JSON,
                defaultValue: { "quater": 0.000, "half": 0.000, "yearly": 0.000 },
                get() {
                    const value = this.getDataValue('students_breakdown');
                    return value ? JSON.parse(value) : []; 
                },
            },
            teachers_breakdown: {
                type: DataTypes.JSON,
                defaultValue: { "quater": 0.000, "half": 0.000, "yearly": 0.000 },
                get() {
                    const value = this.getDataValue('teachers_breakdown');
                    return value ? JSON.parse(value) : [];
                },
            },
        }, {
        timestamps: false,
    });

    return Price;
};

