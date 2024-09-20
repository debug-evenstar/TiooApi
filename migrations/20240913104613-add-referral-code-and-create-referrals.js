'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('accounts', 'referral_code', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.createTable('referrals', {
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
          model: 'accounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      referral_type: {
        type: Sequelize.ENUM(['student','publisher','agent']),
        allowNull: true,
      },
      reward_granted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      reward_amount:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback the changes
    await queryInterface.removeColumn('accounts', 'referral_code'); // Remove the referral_code column from the accounts table
    await queryInterface.dropTable('referrals'); // Drop the referrals table
  }
};
