const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { displayName, email, password, weeklyQuota, personalGoals } = req.body;

  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    displayName,
    email,
    password,
    weeklyQuota: weeklyQuota || 1,
    personalGoals: personalGoals || [],
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff`
  });

  if (user) {
    const token = generateToken(user.id);

    // Set JWT as an HTTP-Only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      weeklyQuota: user.weeklyQuota,
      personalGoals: user.personalGoals,
      avatar: user.avatar,
      dateCount: user.dateCount,
      newNumbersCount: user.newNumbersCount,
      completionPercentage: user.completionPercentage,
      isAnonymous: user.isAnonymous
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user.id);

    // Set JWT as an HTTP-Only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      weeklyQuota: user.weeklyQuota,
      personalGoals: user.personalGoals,
      avatar: user.avatar,
      dateCount: user.dateCount,
      newNumbersCount: user.newNumbersCount,
      completionPercentage: user.completionPercentage,
      isAnonymous: user.isAnonymous
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (user) {
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.weeklyQuota = req.body.weeklyQuota !== undefined ? req.body.weeklyQuota : user.weeklyQuota;
    user.personalGoals = req.body.personalGoals || user.personalGoals;
    user.isAnonymous = req.body.isAnonymous !== undefined ? req.body.isAnonymous : user.isAnonymous;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      displayName: updatedUser.displayName,
      email: updatedUser.email,
      weeklyQuota: updatedUser.weeklyQuota,
      personalGoals: updatedUser.personalGoals,
      avatar: updatedUser.avatar,
      dateCount: updatedUser.dateCount,
      newNumbersCount: updatedUser.newNumbersCount,
      completionPercentage: updatedUser.completionPercentage,
      isAnonymous: updatedUser.isAnonymous
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Get leaderboard data
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  const users = await User.findAll({
    attributes: [
      'id',
      'displayName',
      'avatar',
      'dateCount',
      'newNumbersCount',
      'completionPercentage',
      'burnoutLevel',
      'dateVariety',
      'isAnonymous'
    ],
    order: [['dateCount', 'DESC']]
  });

  // Process leaderboard data
  const leaderboardData = {
    mostDates: users.map(user => ({
      name: user.isAnonymous ? 'Anonymous User' : user.displayName,
      avatar: user.avatar,
      value: user.dateCount
    })),
    newNumbers: users.map(user => ({
      name: user.isAnonymous ? 'Anonymous User' : user.displayName,
      avatar: user.avatar,
      value: user.newNumbersCount
    })).sort((a, b) => b.value - a.value),
    completion: users.map(user => ({
      name: user.isAnonymous ? 'Anonymous User' : user.displayName,
      avatar: user.avatar,
      value: user.completionPercentage
    })).sort((a, b) => b.value - a.value),
    burnout: users.map(user => ({
      name: user.isAnonymous ? 'Anonymous User' : user.displayName,
      avatar: user.avatar,
      value: user.burnoutLevel
    })).sort((a, b) => a.value - b.value), // Lower is better for burnout
    variety: users.map(user => ({
      name: user.isAnonymous ? 'Anonymous User' : user.displayName,
      avatar: user.avatar,
      value: user.dateVariety
    })).sort((a, b) => b.value - a.value)
  };

  res.json(leaderboardData);
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getLeaderboard
};