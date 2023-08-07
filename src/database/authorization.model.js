module.exports = (sequelize, DataTypes) => {
  const Authorization = sequelize.define(
    'Authorization',
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "normal"
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "Developer"
      },
      access_level: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const value = this.getDataValue('access_level');
            return value ? JSON.parse(value) : [];
        },
    },
    }, {
    timestamps: false,
  });


  return Authorization;
};

