module.exports = (sequelize, DataTypes) => {
    const Authorization = sequelize.define(
        "Authorization",
        {
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                default: "admin",
            },
            position: {
                type: DataTypes.STRING,
                allowNull: false,
                default: "Developer",
            },
            permissions: {
                type: DataTypes.JSON,
                defaultValue: [],
                get() {
                    const value = this.getDataValue("permissions");
                    // return value ? JSON.parse(value) : [];
                    return value ? value : [];
                },
            },
        },
        { timestamps: false }
    );

    return Authorization;
};
