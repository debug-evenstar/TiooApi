const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Shelf = sequelize.define('Shelf',{
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    account_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'accounts', key: 'id',
      },
      onDelete: 'CASCADE',
    },

    textbook_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'textbooks', key: 'id',
      },
      onDelete: 'CASCADE',
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    }
  })

  return Shelf;
  
}