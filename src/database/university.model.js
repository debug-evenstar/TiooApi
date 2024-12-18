module.exports = (sequelize, Sequelize) => {
  const University = sequelize.define('University',{
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    image_path: {
      type: Sequelize.STRING,
      allowNull: true
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
  })

  return University;
}