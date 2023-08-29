module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      indexes: [
        { unique: true, fields: ['name'] }
      ],
      timestamps: false,
    });

  return Permission;
};

