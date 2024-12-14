module.exports = (sequelize, Sequelize) => {

  const Exam = sequelize.define("Exam", {
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

    exam_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    metadata: {
      type: Sequelize.JSON,
      allowNull: true,
      get() {
        try {
          const data = JSON.parse(this.getDataValue('metadata'))
          return data;
        } catch (err) {
          return null;
        }
      }
    },
    university_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },

    category_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    sub_category_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

  }, {
    timestamps: true
  })



  return Exam;
}