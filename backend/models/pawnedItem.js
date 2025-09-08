'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PawnedItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle. The `models/index` file will
     * call this method automatically.
     */
    static associate(models) {
      // define association here
      PawnedItem.belongsTo(models.PawnTicket, { foreignKey: 'pawn_ticket_id', as: 'pawnTicket' });
      PawnedItem.hasMany(models.Attachment, { foreignKey: 'pawned_item_id', as: 'attachments' });
    }
  }
  PawnedItem.init({
    pawn_ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    estimated_value: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'PawnedItem',
    tableName: 'PawnedItems',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return PawnedItem;
};
