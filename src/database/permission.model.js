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
      }, 
      {
        indexes:[
          { unique : true, fields: ['name'] }
        ],
        timestamps: false,
    });
  
    return Permission;
  };
  
  