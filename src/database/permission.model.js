module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define(
      'Permission',
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
          },
      }, {
      timestamps: false,
    });
  
    return Permission;
  };
  
  