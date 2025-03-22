const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Date = sequelize.define('date', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  vibeSliders: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  activities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  redFlags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  followUpReminder: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dateNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  isNewNumber: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = Date;