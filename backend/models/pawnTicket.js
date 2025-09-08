'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PawnTicket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle. The `models/index` file will
     * call this method automatically.
     */
    static associate(models) {
      // define association here
      PawnTicket.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
      PawnTicket.hasMany(models.PawnedItem, { foreignKey: 'pawn_ticket_id', as: 'pawnedItems' });
      PawnTicket.hasMany(models.Payment, { foreignKey: 'pawn_ticket_id', as: 'payments' });
      PawnTicket.hasMany(models.Attachment, { foreignKey: 'pawn_ticket_id', as: 'attachments' });
      PawnTicket.hasMany(models.Note, { foreignKey: 'pawn_ticket_id', as: 'notes' });
    }
  }
  PawnTicket.init({
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ticket_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    modelName: 'PawnTicket',
    tableName: 'PawnTickets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return PawnTicket;
};
