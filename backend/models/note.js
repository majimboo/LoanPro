'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle. The `models/index` file will
     * call this method automatically.
     */
    static associate(models) {
      // define association here
      Note.belongsTo(models.Loan, { foreignKey: 'loan_id', as: 'loan' });
      Note.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  Note.init({
    loan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note_content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Note',
    tableName: 'Notes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Note;
};
