'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle. The `models/index` file will
     * call this method automatically.
     */
    static associate(models) {
      // define association here
      Loan.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
      Loan.hasMany(models.Collateral, { foreignKey: 'loan_id', as: 'collaterals' });
      Loan.hasMany(models.Payment, { foreignKey: 'loan_id', as: 'payments' });
      Loan.hasMany(models.Attachment, { foreignKey: 'loan_id', as: 'attachments' });
      Loan.hasMany(models.Note, { foreignKey: 'loan_id', as: 'notes' });
    }
  }
  Loan.init({
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loan_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    loan_type: {
      type: DataTypes.ENUM('PAWN', 'TITLE', 'SECURED', 'UNSECURED', 'CHECK_REDISCOUNT'),
      allowNull: false,
      defaultValue: 'PAWN'
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    maturity_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    grace_period_end: DataTypes.DATEONLY,
    principal_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'DUE_SOON', 'OVERDUE', 'REDEEMED', 'FORFEITED'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    outstanding_principal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    accrued_interest: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    penalties: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    }
  }, {
    sequelize,
    modelName: 'Loan',
    tableName: 'Loans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Loan;
};