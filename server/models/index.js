const User = require('./User');
const Date = require('./Date');
const Contact = require('./Contact');

// Define relationships
User.hasMany(Date, { foreignKey: 'userId', as: 'dates' });
Date.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Contact, { foreignKey: 'userId', as: 'contacts' });
Contact.belongsTo(User, { foreignKey: 'userId' });

Contact.hasMany(Date, { foreignKey: 'contactId', as: 'dates' });
Date.belongsTo(Contact, { foreignKey: 'contactId' });

module.exports = {
  User,
  Date,
  Contact
};