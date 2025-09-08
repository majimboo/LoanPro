'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle. The `models/index` file will
     * call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Customer.hasMany(models.Loan, { foreignKey: 'customer_id', as: 'loans' });
      Customer.hasMany(models.Attachment, { foreignKey: 'customer_id', as: 'attachments' }); // Keep this association
    }
  }
  Customer.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: DataTypes.TEXT,
    phone: DataTypes.STRING(50),
    // Removed id_type, id_number, id_photo_front, id_photo_back
    profile_photo: DataTypes.STRING(255)
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'Customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Customer;
};