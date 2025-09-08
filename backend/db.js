const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false, // Disable logging SQL queries to console
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./models/user')(sequelize, DataTypes);
db.Customer = require('./models/customer')(sequelize, DataTypes);
db.PawnTicket = require('./models/pawnTicket')(sequelize, DataTypes);
db.PawnedItem = require('./models/pawnedItem')(sequelize, DataTypes);
db.Payment = require('./models/payment')(sequelize, DataTypes);
db.Attachment = require('./models/attachment')(sequelize, DataTypes);
db.Note = require('./models/note')(sequelize, DataTypes);
db.AuditLog = require('./models/auditLog')(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;