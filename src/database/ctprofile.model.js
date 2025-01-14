module.exports = (sequelize, Sequelize) => {
  const CTProfile = sequelize.define(
    "CTProfile",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      registration_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      other_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telegram_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      whatsapp_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parent_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parent_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      desired_course: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      institution: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subject_combination: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      weak_subject: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      main_challenge: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fear: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      payment_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sender_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      referral_source: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reason_for_joining: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      birthday: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      receipt_files: {
        type: Sequelize.TEXT,
        allowNull: true,
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
      },
    },
    {
      tableName: "ct_profiles",
    }
  );

  return CTProfile;
};
