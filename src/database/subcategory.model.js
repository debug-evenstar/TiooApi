module.exports = (sequelize, Sequelize) => {
  const SubCategory = sequelize.define(
    'SubCategory',{
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'book_categories',
          key: 'id',
        }
      },

      cover: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },{
      timestamps: false
    }
  )

  return SubCategory;
}