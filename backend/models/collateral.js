'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collateral extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle. The `models/index` file will
     * call this method automatically.
     */
    static associate(models) {
      // define association here
      Collateral.belongsTo(models.Loan, { foreignKey: 'loan_id', as: 'loan' });
      Collateral.hasMany(models.Attachment, { foreignKey: 'collateral_id', as: 'attachments' });
    }
  }
  Collateral.init({
    loan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    collateral_type: {
      type: DataTypes.ENUM('PHYSICAL_ITEM', 'VEHICLE_TITLE', 'PROPERTY_TITLE', 'CHECK', 'NONE'),
      allowNull: false,
      defaultValue: 'PHYSICAL_ITEM'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estimated_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    // For physical items
    item_name: DataTypes.STRING,
    // For checks
    check_number: DataTypes.STRING,
    check_date: DataTypes.DATEONLY,
    check_amount: DataTypes.DECIMAL(10, 2),
    bank_name: DataTypes.STRING,
    drawer_name: DataTypes.STRING,
    // For vehicle titles
    vehicle_make: DataTypes.STRING,
    vehicle_model: DataTypes.STRING,
    vehicle_year: DataTypes.INTEGER,
    vehicle_vin: DataTypes.STRING,
    // For property titles
    property_address: DataTypes.TEXT,
    property_type: DataTypes.STRING,
    title_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Collateral',
    tableName: 'Collaterals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Collateral;
};