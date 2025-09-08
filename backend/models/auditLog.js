'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle. The `models/index` file will
     * call this method automatically.
     */
    static associate(models) {
      // define association here
      AuditLog.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  AuditLog.init({
    user_id: DataTypes.INTEGER,
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entity_type: DataTypes.STRING,
    entity_id: DataTypes.INTEGER,
    details: DataTypes.TEXT,
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'AuditLogs',
    timestamps: false // Audit logs typically don't need updated_at
  });
  return AuditLog;
};
