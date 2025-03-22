const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  weeklyQuota: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 0,
      max: 10
    }
  },
  personalGoals: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'https://ui-avatars.com/api/?background=random'
  },
  dateCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  newNumbersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completionPercentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  burnoutLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 0,
      max: 10
    }
  },
  dateVariety: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to compare passwords
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;