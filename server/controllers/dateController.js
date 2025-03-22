const { Date, Contact, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Add a new date
// @route   POST /api/dates
// @access  Private
const addDate = async (req, res) => {
  const { 
    contactId, 
    contactName, 
    dateTime, 
    location, 
    notes, 
    rating, 
    vibeSliders,
    status,
    activities,
    redFlags,
    followUpReminder,
    isNewNumber
  } = req.body;

  // Find or create contact
  let contact;
  if (contactId) {
    contact = await Contact.findOne({ 
      where: { id: contactId, userId: req.user.id } 
    });
    
    if (!contact) {
      res.status(404);
      throw new Error('Contact not found');
    }
  } else if (contactName) {
    // Try to find existing contact with this name for this user
    contact = await Contact.findOne({
      where: { 
        name: contactName,
        userId: req.user.id
      }
    });

    // If not found, create new contact
    if (!contact) {
      contact = await Contact.create({
        name: contactName,
        userId: req.user.id,
        status: 'new'
      });
    }
  } else {
    res.status(400);
    throw new Error('Contact name or ID is required');
  }

  // Check if this is a follow-up date
  const previousDates = await Date.count({
    where: {
      contactId: contact.id,
      userId: req.user.id
    }
  });

  const dateNumber = previousDates + 1;

  // Create the date
  const date = await Date.create({
    contactId: contact.id,
    userId: req.user.id,
    dateTime,
    location,
    notes,
    rating,
    vibeSliders,
    status: status || 'upcoming',
    activities: activities || [],
    redFlags: redFlags || [],
    followUpReminder,
    dateNumber,
    isNewNumber: isNewNumber || dateNumber === 1
  });

  // Update user stats
  const user = await User.findByPk(req.user.id);
  
  user.dateCount += 1;
  
  if (date.isNewNumber) {
    user.newNumbersCount += 1;
  }
  
  // Calculate quota completion percentage
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);
  
  const weeklyDates = await Date.count({
    where: {
      userId: req.user.id,
      createdAt: {
        [Op.between]: [thisWeekStart, thisWeekEnd]
      }
    }
  });
  
  user.completionPercentage = user.weeklyQuota > 0 
    ? Math.min(100, (weeklyDates / user.weeklyQuota) * 100) 
    : 100;
  
  // Calculate date variety
  const uniqueActivities = await Date.findAll({
    attributes: ['activities'],
    where: { userId: req.user.id }
  });
  
  const allActivities = new Set();
  uniqueActivities.forEach(date => {
    date.activities.forEach(activity => allActivities.add(activity));
  });
  
  user.dateVariety = allActivities.size;

  // Update contact average rating if date is completed
  if (status === 'completed' && rating) {
    const contactDates = await Date.findAll({
      where: {
        contactId: contact.id,
        rating: { [Op.not]: null }
      }
    });
    
    const totalRating = contactDates.reduce((sum, date) => sum + date.rating, 0);
    contact.avgRating = totalRating / contactDates.length;
    
    // Update contact status based on latest date
    if (rating >= 4) {
      contact.status = 'interested';
    } else if (rating <= 2) {
      contact.status = 'ghosted';
    } else if (dateNumber > 1) {
      contact.status = 'repeat';
    }
    
    await contact.save();
  }
  
  await user.save();

  res.status(201).json(date);
};

// @desc    Get user's dates
// @route   GET /api/dates
// @access  Private
const getDates = async (req, res) => {
  const filters = {};
  
  // Apply status filter
  if (req.query.status) {
    filters.status = req.query.status;
  }

  // Apply date range filter
  if (req.query.startDate && req.query.endDate) {
    filters.dateTime = {
      [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate)]
    };
  } else if (req.query.startDate) {
    filters.dateTime = {
      [Op.gte]: new Date(req.query.startDate)
    };
  } else if (req.query.endDate) {
    filters.dateTime = {
      [Op.lte]: new Date(req.query.endDate)
    };
  }

  const dates = await Date.findAll({
    where: {
      userId: req.user.id,
      ...filters
    },
    include: [
      { 
        model: Contact,
        attributes: ['id', 'name', 'status', 'avgRating', 'tags']
      }
    ],
    order: [['dateTime', 'DESC']]
  });

  res.json(dates);
};

// @desc    Get date by ID
// @route   GET /api/dates/:id
// @access  Private
const getDateById = async (req, res) => {
  const date = await Date.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    },
    include: [
      { 
        model: Contact,
        attributes: ['id', 'name', 'status', 'avgRating', 'tags', 'notes']
      }
    ]
  });

  if (date) {
    res.json(date);
  } else {
    res.status(404);
    throw new Error('Date not found');
  }
};

// @desc    Update date
// @route   PUT /api/dates/:id
// @access  Private
const updateDate = async (req, res) => {
  const date = await Date.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  });

  if (!date) {
    res.status(404);
    throw new Error('Date not found');
  }

  // Check if status changed from upcoming to completed
  const wasCompleted = req.body.status === 'completed' && date.status !== 'completed';

  // Update fields
  Object.keys(req.body).forEach(key => {
    date[key] = req.body[key];
  });

  const updatedDate = await date.save();

  // If date was newly completed, update contact rating
  if (wasCompleted && date.rating) {
    const contact = await Contact.findByPk(date.contactId);
    
    if (contact) {
      const contactDates = await Date.findAll({
        where: {
          contactId: contact.id,
          rating: { [Op.not]: null }
        }
      });
      
      const totalRating = contactDates.reduce((sum, date) => sum + date.rating, 0);
      contact.avgRating = totalRating / contactDates.length;
      
      // Update contact status based on latest date
      if (date.rating >= 4) {
        contact.status = 'interested';
      } else if (date.rating <= 2) {
        contact.status = 'ghosted';
      } else if (date.dateNumber > 1) {
        contact.status = 'repeat';
      }
      
      await contact.save();
    }
  }

  res.json(updatedDate);
};

// @desc    Delete date
// @route   DELETE /api/dates/:id
// @access  Private
const deleteDate = async (req, res) => {
  const date = await Date.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  });

  if (!date) {
    res.status(404);
    throw new Error('Date not found');
  }

  await date.destroy();

  // Update user stats
  const user = await User.findByPk(req.user.id);
  
  user.dateCount = Math.max(0, user.dateCount - 1);
  
  if (date.isNewNumber) {
    user.newNumbersCount = Math.max(0, user.newNumbersCount - 1);
  }
  
  await user.save();

  res.json({ message: 'Date removed' });
};

// @desc    Get date insights and patterns
// @route   GET /api/dates/insights
// @access  Private
const getDateInsights = async (req, res) => {
  const dates = await Date.findAll({
    where: { userId: req.user.id, status: 'completed' },
    include: [{ model: Contact, attributes: ['name'] }],
    order: [['dateTime', 'ASC']]
  });

  if (dates.length < 3) {
    return res.json({
      message: "You need more dating experience before getting meaningful insights.",
      insights: [],
      patterns: null
    });
  }

  // Analyze patterns
  const patterns = {
    successFactors: [],
    redFlags: [],
    idealDayOfWeek: null,
    highestRatedActivities: [],
  };

  // Find good dates (rating > 3)
  const goodDates = dates.filter(date => date.rating > 3);
  const badDates = dates.filter(date => date.rating < 3);

  // Find common elements in good dates
  if (goodDates.length > 1) {
    // Find common activities
    const activities = goodDates.flatMap(date => date.activities);
    const activityCount = {};
    activities.forEach(act => {
      activityCount[act] = (activityCount[act] || 0) + 1;
    });

    // Find activities that appear in at least 30% of good dates
    Object.entries(activityCount).forEach(([activity, count]) => {
      if (count >= goodDates.length * 0.3) {
        patterns.highestRatedActivities.push(activity);
        patterns.successFactors.push(`${activity} dates tend to go well for you`);
      }
    });

    // Find ideal day of week
    const dayCount = {};
    goodDates.forEach(date => {
      const day = new Date(date.dateTime).getDay();
      dayCount[day] = (dayCount[day] || 0) + 1;
    });

    let maxCount = 0;
    let bestDay = null;
    
    Object.entries(dayCount).forEach(([day, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestDay = parseInt(day);
      }
    });

    if (bestDay !== null) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      patterns.idealDayOfWeek = days[bestDay];
    }
  }

  // Find common red flags in bad dates
  if (badDates.length > 0) {
    const redFlags = badDates.flatMap(date => date.redFlags);
    const redFlagCount = {};
    redFlags.forEach(flag => {
      redFlagCount[flag] = (redFlagCount[flag] || 0) + 1;
    });

    // Find red flags that appear in at least 30% of bad dates
    Object.entries(redFlagCount).forEach(([flag, count]) => {
      if (count >= badDates.length * 0.3) {
        patterns.redFlags.push(flag);
      }
    });
  }

  // Generate insights
  const insights = [];
  const avgRating = dates.reduce((sum, date) => sum + date.rating, 0) / dates.length;
  
  // Overall dating success rate
  if (avgRating < 2.5) {
    insights.push("Your dating choices are consistently poor. Consider being more selective or adjusting your approach.");
  } else if (avgRating < 3.5) {
    insights.push("You're settling for mediocre dates. Aim higher and be more intentional with your choices.");
  }

  // Red flag patterns
  if (patterns.redFlags && patterns.redFlags.length > 0) {
    insights.push(`You repeatedly encounter these red flags: ${patterns.redFlags.join(', ')}. Be more aware of these warning signs.`);
  }

  // Success patterns
  if (patterns.successFactors && patterns.successFactors.length > 0) {
    insights.push(`Success pattern: ${patterns.successFactors[0]}. Focus on this more.`);
  }

  // Day of week recommendation
  if (patterns.idealDayOfWeek) {
    insights.push(`You tend to have better dates on ${patterns.idealDayOfWeek}s. Consider scheduling more dates on this day.`);
  }

  // Consecutive bad dates
  let maxConsecutiveBadDates = 0;
  let currentStreak = 0;

  // Sort dates by date
  const sortedDates = [...dates].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  
  for (const date of sortedDates) {
    if (date.rating < 3) {
      currentStreak++;
      maxConsecutiveBadDates = Math.max(maxConsecutiveBadDates, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  if (maxConsecutiveBadDates >= 3) {
    insights.push(`You had ${maxConsecutiveBadDates} bad dates in a row. Consider taking a break to reassess your approach.`);
  }

  res.json({
    patterns,
    insights,
    stats: {
      totalDates: dates.length,
      averageRating: avgRating,
      goodDatesPercentage: (goodDates.length / dates.length) * 100,
      mostCommonActivities: patterns.highestRatedActivities,
      commonRedFlags: patterns.redFlags
    }
  });
};

module.exports = {
  addDate,
  getDates,
  getDateById,
  updateDate,
  deleteDate,
  getDateInsights
};