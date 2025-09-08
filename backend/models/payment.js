'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle. The `models/index` file will
     * call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Loan, { foreignKey: 'loan_id', as: 'loan' });
    }
  }
  Payment.init({
    loan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_type: {
      type: DataTypes.ENUM('INTEREST', 'PARTIAL', 'FULL', 'PENALTY'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Payment;
};
