'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle. The `models/index` file will
     * call this method automatically.
     */
    static associate(models) {
      // define association here
      Attachment.belongsTo(models.Collateral, { foreignKey: 'collateral_id', as: 'collateral' });
      Attachment.belongsTo(models.Loan, { foreignKey: 'loan_id', as: 'loan' });
      Attachment.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' }); // Ensure this association exists
    }
  }
  Attachment.init({
    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    collateral_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Can be null if attachment is for other entities
    },
    loan_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Can be null if attachment is for other entities
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Can be null if attachment is for a pawned item
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'collateral' // Default type
    },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Attachment',
    tableName: 'Attachments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Attachment;
};