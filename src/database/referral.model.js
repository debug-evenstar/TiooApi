module.exports = (sequelize, Sequelize) => {
  const Referral = sequelize.define(
    "Referral", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    referrer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    referred_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts', // Reference to the accounts table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    referral_type: {
      type: Sequelize.ENUM(['student', 'publisher', 'agent']),
      allowNull: true,
    },
    reward_granted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    reward_amount: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
    },
  })

  return Referral;
}