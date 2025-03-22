import React, { createContext, useState, useEffect } from 'react';

// Dummy data for profiles
const DUMMY_PROFILES = {
  'Porter': {
    name: 'Porter',
    age: 28,
    bio: 'Adventure seeker and coffee enthusiast. Looking for someone who can keep up on hikes.',
    interests: ['Hiking', 'Photography', 'Coffee', 'Travel', 'Rock Climbing'],
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  'Kyle': {
    name: 'Kyle',
    age: 26,
    bio: 'Finance bro by day, foodie by night. Always looking for the next great restaurant.',
    interests: ['Food', 'Wine', 'Fitness', 'Investing', 'Golf'],
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
  },
  'Jonny': {
    name: 'Jonny',
    age: 29,
    bio: 'Musician and night owl. My ideal date involves live music and deep conversations.',
    interests: ['Music', 'Concerts', 'Guitar', 'Philosophy', 'Craft Beer'],
    avatar: 'https://randomuser.me/api/portraits/men/64.jpg'
  },
  'Cole': {
    name: 'Cole',
    age: 27,
    bio: 'Tech nerd with a passion for sci-fi. Looking for my player two.',
    interests: ['Gaming', 'Technology', 'Movies', 'Sci-Fi', 'Board Games'],
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
  },
  'Adam': {
    name: 'Adam',
    age: 30,
    bio: 'Outdoor enthusiast and dog lover. Swipe right if you have a cute dog.',
    interests: ['Dogs', 'Running', 'Camping', 'Cooking', 'Podcasts'],
    avatar: 'https://randomuser.me/api/portraits/men/17.jpg'
  },
  'Jake': {
    name: 'Jake',
    age: 25,
    bio: 'Bookworm and art gallery regular. Looking for someone to explore museums with.',
    interests: ['Reading', 'Art', 'Museums', 'History', 'Jazz'],
    avatar: 'https://randomuser.me/api/portraits/men/90.jpg'
  }
};

// Dummy date data
const DUMMY_DATES = [
  // Porter's dates
  {
    id: '1',
    name: 'Sarah',
    date: '2025-02-10T18:00:00',
    type: 'App Match',
    activities: ['Dinner', 'Drinks'],
    dateNumber: 1,
    rating: 7,
    redFlags: [],
    notes: 'Great conversation, shared interest in hiking. Planning a trail date next time.',
    userId: 'Porter'
  },
  {
    id: '2',
    name: 'Sarah',
    date: '2025-02-17T10:00:00',
    type: 'App Match',
    activities: ['Hiking', 'Picnic'],
    dateNumber: 2,
    rating: 9,
    redFlags: [],
    notes: 'Amazing hike at Rattlesnake Ridge. Really enjoyed her company and energy level matched mine.',
    userId: 'Porter'
  },
  {
    id: '3',
    name: 'Jessica',
    date: '2025-01-25T19:00:00',
    type: 'Setup',
    activities: ['Dinner', 'Movie'],
    dateNumber: 1,
    rating: 4,
    redFlags: ['Constantly on phone', 'Dismissive of my interests'],
    notes: 'Didn\'t feel much chemistry. She seemed bored the whole time.',
    userId: 'Porter'
  },
  {
    id: '4',
    name: 'Megan',
    date: '2025-03-05T20:00:00',
    type: 'App Match',
    activities: ['Coffee', 'Walk'],
    dateNumber: 1,
    rating: 8,
    redFlags: [],
    notes: 'Great connection, loved her enthusiasm for photography. Planning another date next week.',
    userId: 'Porter'
  },

  // Kyle's dates
  {
    id: '5',
    name: 'Ashley',
    date: '2025-02-05T19:30:00',
    type: 'App Match',
    activities: ['Dinner', 'Drinks'],
    dateNumber: 1,
    rating: 6,
    redFlags: ['Seemed materialistic'],
    notes: 'Nice restaurant experience but conversation was a bit shallow.',
    userId: 'Kyle'
  },
  {
    id: '6',
    name: 'Ashley',
    date: '2025-02-12T20:00:00',
    type: 'App Match',
    activities: ['Wine Tasting'],
    dateNumber: 2,
    rating: 5,
    redFlags: ['Talked about ex', 'Materialistic'],
    notes: 'Decent time but she kept mentioning her ex. Not sure I want to pursue further.',
    userId: 'Kyle'
  },
  {
    id: '7',
    name: 'Nicole',
    date: '2025-02-28T18:00:00',
    type: 'Setup',
    activities: ['Dinner', 'Cocktail Bar'],
    dateNumber: 1,
    rating: 9,
    redFlags: [],
    notes: 'Incredible date at that new fusion place. She knew so much about food and we had great conversation.',
    userId: 'Kyle'
  },
  {
    id: '8',
    name: 'Nicole',
    date: '2025-03-07T17:00:00',
    type: 'Setup',
    activities: ['Cooking Class'],
    dateNumber: 2,
    rating: 10,
    redFlags: [],
    notes: 'Best date ever! We made pasta from scratch and had amazing chemistry in the kitchen.',
    userId: 'Kyle'
  },

  // Jonny's dates
  {
    id: '9',
    name: 'Emma',
    date: '2025-01-15T21:00:00',
    type: 'Met in Person',
    activities: ['Concert', 'Drinks'],
    dateNumber: 1,
    rating: 9,
    redFlags: [],
    notes: 'Met at the indie show. Amazing connection over music, stayed talking until 2am.',
    userId: 'Jonny'
  },
  {
    id: '10',
    name: 'Emma',
    date: '2025-01-22T20:00:00',
    type: 'Met in Person',
    activities: ['Dinner', 'Live Music'],
    dateNumber: 2,
    rating: 7,
    redFlags: ['Different political values'],
    notes: 'Good time but discovered some political differences that might be challenging.',
    userId: 'Jonny'
  },
  {
    id: '11',
    name: 'Lily',
    date: '2025-02-05T19:00:00',
    type: 'App Match',
    activities: ['Coffee', 'Record Store'],
    dateNumber: 1,
    rating: 4,
    redFlags: ['No musical interests', 'Constantly checking phone'],
    notes: 'No chemistry. She doesn\'t listen to any of the same music and seemed distracted.',
    userId: 'Jonny'
  },
  {
    id: '12',
    name: 'Zoe',
    date: '2025-03-01T21:30:00',
    type: 'App Match',
    activities: ['Bar', 'Live Music'],
    dateNumber: 1,
    rating: 8,
    redFlags: [],
    notes: 'Great conversation about music theory. She plays piano and we really connected.',
    userId: 'Jonny'
  },

  // Cole's dates
  {
    id: '13',
    name: 'Rachel',
    date: '2025-01-20T18:00:00',
    type: 'App Match',
    activities: ['Board Games', 'Dinner'],
    dateNumber: 1,
    rating: 8,
    redFlags: [],
    notes: 'Great time playing Settlers of Catan. She\'s competitive but fun.',
    userId: 'Cole'
  },
  {
    id: '14',
    name: 'Rachel',
    date: '2025-01-27T19:00:00',
    type: 'App Match',
    activities: ['Movie', 'Drinks'],
    dateNumber: 2,
    rating: 9,
    redFlags: [],
    notes: 'Saw the new sci-fi film and had an amazing discussion about it after. She gets my nerdy side.',
    userId: 'Cole'
  },
  {
    id: '15',
    name: 'Olivia',
    date: '2025-02-14T17:00:00',
    type: 'Setup',
    activities: ['Coffee', 'Bookstore'],
    dateNumber: 1,
    rating: 3,
    redFlags: ['Dismissive of my interests', 'Rude to service staff'],
    notes: 'She made fun of my gaming hobby and was snippy with the barista. No second date.',
    userId: 'Cole'
  },
  {
    id: '16',
    name: 'Maya',
    date: '2025-03-02T16:00:00',
    type: 'App Match',
    activities: ['Arcade', 'Pizza'],
    dateNumber: 1,
    rating: 7,
    redFlags: [],
    notes: 'Fun time at the retro arcade. She\'s really good at Street Fighter!',
    userId: 'Cole'
  },

  // Adam's dates
  {
    id: '17',
    name: 'Taylor',
    date: '2025-01-10T10:00:00',
    type: 'Met in Person',
    activities: ['Dog Park', 'Coffee'],
    dateNumber: 1,
    rating: 8,
    redFlags: [],
    notes: 'Met at the dog park. Her golden retriever and my lab got along great, as did we.',
    userId: 'Adam'
  },
  {
    id: '18',
    name: 'Taylor',
    date: '2025-01-17T09:00:00',
    type: 'Met in Person',
    activities: ['Hiking', 'Picnic'],
    dateNumber: 2,
    rating: 9,
    redFlags: [],
    notes: 'Amazing hike with both dogs. The weather was perfect and conversation flowed naturally.',
    userId: 'Adam'
  },
  {
    id: '19',
    name: 'Taylor',
    date: '2025-01-24T18:00:00',
    type: 'Met in Person',
    activities: ['Dinner', 'Movie'],
    dateNumber: 3,
    rating: 9,
    redFlags: [],
    notes: 'First indoor date without the dogs. Chemistry is still strong, I really like her.',
    userId: 'Adam'
  },
  {
    id: '20',
    name: 'Kayla',
    date: '2025-02-20T19:00:00',
    type: 'App Match',
    activities: ['Dinner', 'Drinks'],
    dateNumber: 1,
    rating: 4,
    redFlags: ['Doesn\'t like dogs', 'Negative about everything'],
    notes: 'Dealbreaker: she\'s "not a dog person." Also complained about everything the whole night.',
    userId: 'Adam'
  },

  // Jake's dates
  {
    id: '21',
    name: 'Hannah',
    date: '2025-01-05T14:00:00',
    type: 'App Match',
    activities: ['Museum', 'Coffee'],
    dateNumber: 1,
    rating: 9,
    redFlags: [],
    notes: 'Amazing conversation at the modern art exhibit. She has such interesting perspectives.',
    userId: 'Jake'
  },
  {
    id: '22',
    name: 'Hannah',
    date: '2025-01-12T19:00:00',
    type: 'App Match',
    activities: ['Jazz Club', 'Drinks'],
    dateNumber: 2,
    rating: 8,
    redFlags: [],
    notes: 'Great evening listening to jazz. She knows so much about music history.',
    userId: 'Jake'
  },
  {
    id: '23',
    name: 'Grace',
    date: '2025-02-08T16:00:00',
    type: 'Setup',
    activities: ['Bookstore', 'Coffee'],
    dateNumber: 1,
    rating: 6,
    redFlags: ['Different sense of humor', 'Only talks about herself'],
    notes: 'She\'s nice but didn\'t ask me a single question about myself the whole time.',
    userId: 'Jake'
  },
  {
    id: '24',
    name: 'Claire',
    date: '2025-03-01T13:00:00',
    type: 'App Match',
    activities: ['Art Gallery', 'Lunch'],
    dateNumber: 1,
    rating: 7,
    redFlags: [],
    notes: 'Enjoyable gallery visit. She\'s an artist herself and had fascinating insights.',
    userId: 'Jake'
  }
];

// Dummy assessment data
const DUMMY_ASSESSMENTS = [
  // Porter's assessments
  {
    id: '1',
    date: '2025-02-18T12:00:00',
    shared_interests: ['Hiking', 'Photography', 'Travel'],
    shared_values: ['Adventure', 'Health', 'Independence'],
    communication_compatibility: 8,
    emotional_compatibility: 7,
    lifestyle_compatibility: 9,
    conflict_resolution: 6,
    long_term_potential: 8,
    physical_attraction: 9,
    red_flags: [],
    communication_style: 'Direct',
    partner_communication_style: 'Direct',
    notes: 'Sarah and I really connect on our love for the outdoors. Our communication styles match well.',
    userId: 'Porter'
  },
  
  // Kyle's assessments
  {
    id: '2',
    date: '2025-03-08T15:00:00',
    shared_interests: ['Food', 'Wine', 'Cooking'],
    shared_values: ['Financial Security', 'Work/Life Balance', 'Adventure'],
    communication_compatibility: 9,
    emotional_compatibility: 8,
    lifestyle_compatibility: 8,
    conflict_resolution: 7,
    long_term_potential: 9,
    physical_attraction: 10,
    red_flags: [],
    communication_style: 'Analytical',
    partner_communication_style: 'Intuitive',
    notes: 'Nicole and I have amazing chemistry. Our few differences in communication style actually complement each other well.',
    userId: 'Kyle'
  },
  
  // Jonny's assessments
  {
    id: '3',
    date: '2025-01-23T14:00:00',
    shared_interests: ['Music', 'Concerts', 'Philosophy'],
    shared_values: ['Creativity', 'Independence', 'Social Justice'],
    communication_compatibility: 7,
    emotional_compatibility: 8,
    lifestyle_compatibility: 6,
    conflict_resolution: 5,
    long_term_potential: 6,
    physical_attraction: 9,
    red_flags: ['Different political values'],
    communication_style: 'Emotional',
    partner_communication_style: 'Logical',
    notes: 'Emma and I connect deeply on music and art, but our political differences might be a challenge.',
    userId: 'Jonny'
  },
  
  // Cole's assessments
  {
    id: '4',
    date: '2025-01-28T18:00:00',
    shared_interests: ['Gaming', 'Movies', 'Sci-Fi', 'Board Games'],
    shared_values: ['Technology', 'Creativity', 'Honesty'],
    communication_compatibility: 9,
    emotional_compatibility: 8,
    lifestyle_compatibility: 9,
    conflict_resolution: 8,
    long_term_potential: 9,
    physical_attraction: 8,
    red_flags: [],
    communication_style: 'Analytical',
    partner_communication_style: 'Analytical',
    notes: 'Rachel and I are incredibly compatible with our shared interests and communication style.',
    userId: 'Cole'
  },
  
  // Adam's assessments
  {
    id: '5',
    date: '2025-01-25T16:00:00',
    shared_interests: ['Dogs', 'Hiking', 'Outdoor Activities'],
    shared_values: ['Health', 'Family', 'Loyalty'],
    communication_compatibility: 9,
    emotional_compatibility: 8,
    lifestyle_compatibility: 9,
    conflict_resolution: 7,
    long_term_potential: 9,
    physical_attraction: 8,
    red_flags: [],
    communication_style: 'Direct',
    partner_communication_style: 'Personal',
    notes: 'Taylor and I have a really strong connection. Our shared love for dogs and outdoors is a great foundation.',
    userId: 'Adam'
  },
  
  // Jake's assessments
  {
    id: '6',
    date: '2025-01-13T17:00:00',
    shared_interests: ['Art', 'Music', 'Museums', 'Reading'],
    shared_values: ['Creativity', 'Cultural experiences', 'Learning'],
    communication_compatibility: 8,
    emotional_compatibility: 7,
    lifestyle_compatibility: 7,
    conflict_resolution: 8,
    long_term_potential: 7,
    physical_attraction: 8,
    red_flags: [],
    communication_style: 'Intuitive',
    partner_communication_style: 'Analytical',
    notes: 'Hannah and I connect well on intellectual and creative levels. Our different communication styles create interesting dynamics.',
    userId: 'Jake'
  }
];

// Dummy goals data
const DUMMY_GOALS = [
  {
    id: '1',
    title: 'Be more open to different types of activities',
    category: 'Dating Experience',
    created: '2025-01-01T12:00:00',
    completed: true,
    userId: 'Porter'
  },
  {
    id: '2',
    title: 'Improve active listening skills',
    category: 'Communication',
    created: '2025-02-01T12:00:00',
    completed: false,
    userId: 'Porter'
  },
  {
    id: '3',
    title: 'Be more selective with app matches',
    category: 'Dating Quality',
    created: '2025-01-15T12:00:00',
    completed: true,
    userId: 'Kyle'
  },
  {
    id: '4',
    title: 'Work on not dominating the conversation',
    category: 'Communication',
    created: '2025-02-10T12:00:00',
    completed: false,
    userId: 'Kyle'
  },
  {
    id: '5',
    title: 'Be open to dating outside music scene',
    category: 'Dating Variety',
    created: '2025-01-05T12:00:00',
    completed: false,
    userId: 'Jonny'
  },
  {
    id: '6',
    title: 'Work on emotional vulnerability',
    category: 'Personal Growth',
    created: '2025-02-05T12:00:00',
    completed: false,
    userId: 'Jonny'
  },
  {
    id: '7',
    title: 'Talk less about video games on first dates',
    category: 'First Impressions',
    created: '2025-01-10T12:00:00',
    completed: true,
    userId: 'Cole'
  },
  {
    id: '8',
    title: 'Be more assertive about my interests',
    category: 'Communication',
    created: '2025-02-15T12:00:00',
    completed: false,
    userId: 'Cole'
  },
  {
    id: '9',
    title: 'Maintain better contact between dates',
    category: 'Communication',
    created: '2025-01-20T12:00:00',
    completed: true,
    userId: 'Adam'
  },
  {
    id: '10',
    title: 'Don\'t let dogs dominate every conversation',
    category: 'Balance',
    created: '2025-02-20T12:00:00',
    completed: false,
    userId: 'Adam'
  },
  {
    id: '11',
    title: 'Be less judgmental about pop culture interests',
    category: 'Openness',
    created: '2025-01-25T12:00:00',
    completed: true,
    userId: 'Jake'
  },
  {
    id: '12',
    title: 'Improve small talk skills',
    category: 'Communication',
    created: '2025-02-25T12:00:00',
    completed: false,
    userId: 'Jake'
  }
];

// Burnout levels for each user
const DUMMY_BURNOUT_LEVELS = {
  'Porter': 3,
  'Kyle': 2,
  'Jonny': 6,
  'Cole': 4,
  'Adam': 1,
  'Jake': 5
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState('Porter');
  const [allProfiles, setAllProfiles] = useState(DUMMY_PROFILES);

  // Data states
  const [dates, setDates] = useState(() => {
    const savedDates = localStorage.getItem('datingInsights_dates');
    return savedDates ? JSON.parse(savedDates) : DUMMY_DATES.filter(date => date.userId === currentUser);
  });

  const [assessments, setAssessments] = useState(() => {
    const savedAssessments = localStorage.getItem('datingInsights_assessments');
    return savedAssessments ? JSON.parse(savedAssessments) : DUMMY_ASSESSMENTS.filter(assessment => assessment.userId === currentUser);
  });

  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('datingInsights_goals');
    return savedGoals ? JSON.parse(savedGoals) : DUMMY_GOALS.filter(goal => goal.userId === currentUser);
  });

  const [burnoutLevel, setBurnoutLevel] = useState(() => {
    const savedLevel = localStorage.getItem('datingInsights_burnoutLevel');
    return savedLevel ? parseInt(savedLevel) : DUMMY_BURNOUT_LEVELS[currentUser];
  });

  // Social stats
  const [socialStats, setSocialStats] = useState({
    dateCounts: {
      'Porter': DUMMY_DATES.filter(date => date.userId === 'Porter').length,
      'Kyle': DUMMY_DATES.filter(date => date.userId === 'Kyle').length,
      'Jonny': DUMMY_DATES.filter(date => date.userId === 'Jonny').length,
      'Cole': DUMMY_DATES.filter(date => date.userId === 'Cole').length,
      'Adam': DUMMY_DATES.filter(date => date.userId === 'Adam').length,
      'Jake': DUMMY_DATES.filter(date => date.userId === 'Jake').length,
    },
    avgRatings: {
      'Porter': calculateAvgRating('Porter'),
      'Kyle': calculateAvgRating('Kyle'),
      'Jonny': calculateAvgRating('Jonny'),
      'Cole': calculateAvgRating('Cole'),
      'Adam': calculateAvgRating('Adam'),
      'Jake': calculateAvgRating('Jake'),
    },
    successRates: {
      'Porter': calculateSuccessRate('Porter'),
      'Kyle': calculateSuccessRate('Kyle'),
      'Jonny': calculateSuccessRate('Jonny'),
      'Cole': calculateSuccessRate('Cole'),
      'Adam': calculateSuccessRate('Adam'),
      'Jake': calculateSuccessRate('Jake'),
    },
    dateVariety: {
      'Porter': calculateDateVariety('Porter'),
      'Kyle': calculateDateVariety('Kyle'),
      'Jonny': calculateDateVariety('Jonny'),
      'Cole': calculateDateVariety('Cole'),
      'Adam': calculateDateVariety('Adam'),
      'Jake': calculateDateVariety('Jake'),
    },
    burnoutLevels: { ...DUMMY_BURNOUT_LEVELS }
  });

  // Helper functions to calculate stats
  function calculateAvgRating(userId) {
    const userDates = DUMMY_DATES.filter(date => date.userId === userId);
    if (userDates.length === 0) return 0;
    const sum = userDates.reduce((total, date) => total + date.rating, 0);
    return +(sum / userDates.length).toFixed(1);
  }

  function calculateSuccessRate(userId) {
    const userDates = DUMMY_DATES.filter(date => date.userId === userId);
    if (userDates.length === 0) return 0;
    const goodDates = userDates.filter(date => date.rating >= 7).length;
    return +((goodDates / userDates.length) * 100).toFixed(1);
  }

  function calculateDateVariety(userId) {
    const userDates = DUMMY_DATES.filter(date => date.userId === userId);
    if (userDates.length === 0) return 0;
    const uniqueActivities = new Set();
    userDates.forEach(date => {
      date.activities.forEach(activity => uniqueActivities.add(activity));
    });
    return uniqueActivities.size;
  }

  // Update data when current user changes
  useEffect(() => {
    setDates(DUMMY_DATES.filter(date => date.userId === currentUser));
    setAssessments(DUMMY_ASSESSMENTS.filter(assessment => assessment.userId === currentUser));
    setGoals(DUMMY_GOALS.filter(goal => goal.userId === currentUser));
    setBurnoutLevel(DUMMY_BURNOUT_LEVELS[currentUser]);
  }, [currentUser]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('datingInsights_dates', JSON.stringify(dates));
  }, [dates]);

  useEffect(() => {
    localStorage.setItem('datingInsights_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('datingInsights_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('datingInsights_burnoutLevel', burnoutLevel.toString());
    
    // Update social stats when burnout level changes
    setSocialStats(prev => ({
      ...prev,
      burnoutLevels: {
        ...prev.burnoutLevels,
        [currentUser]: burnoutLevel
      }
    }));
  }, [burnoutLevel, currentUser]);

  // Add a new date to the log
  const addDate = (date) => {
    const newDate = { 
      ...date, 
      id: Date.now().toString(),
      userId: currentUser
    };
    setDates([...dates, newDate]);
    
    // Increment burnout level if date was bad
    if (date.rating < 4) {
      setBurnoutLevel(prev => Math.min(prev + 1, 10));
    }
    
    // Update social stats
    setSocialStats(prev => {
      const userDates = [...dates, newDate].filter(d => d.userId === currentUser);
      return {
        ...prev,
        dateCounts: {
          ...prev.dateCounts,
          [currentUser]: userDates.length
        },
        avgRatings: {
          ...prev.avgRatings,
          [currentUser]: userDates.reduce((sum, d) => sum + d.rating, 0) / userDates.length
        },
        successRates: {
          ...prev.successRates,
          [currentUser]: (userDates.filter(d => d.rating >= 7).length / userDates.length) * 100
        },
        dateVariety: {
          ...prev.dateVariety,
          [currentUser]: calculateDateVariety(currentUser)
        }
      };
    });
  };

  // Add a new self-assessment
  const addAssessment = (assessment) => {
    const newAssessment = {
      ...assessment, 
      id: Date.now().toString(), 
      date: new Date().toISOString(),
      userId: currentUser
    };
    setAssessments([...assessments, newAssessment]);
  };

  // Set a new goal
  const addGoal = (goal) => {
    const newGoal = {
      ...goal, 
      id: Date.now().toString(), 
      created: new Date().toISOString(), 
      completed: false,
      userId: currentUser
    };
    setGoals([...goals, newGoal]);
  };

  // Mark goal as completed
  const completeGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: true } : goal
    ));
  };

  // Update burnout level (can be reduced with self-care activities)
  const updateBurnoutLevel = (amount) => {
    setBurnoutLevel(prev => Math.max(0, Math.min(prev + amount, 10)));
  };

  // Switch user
  const switchUser = (username) => {
    setCurrentUser(username);
  };

  // Identify patterns in dating history
  const identifyPatterns = () => {
    const userDates = dates.filter(date => date.userId === currentUser);
    if (userDates.length < 3) return null;

    const patterns = {
      successFactors: [],
      redFlags: [],
      idealDayOfWeek: null,
      highestRatedTypes: [],
    };

    // Analyze successful dates (rating > 7)
    const goodDates = userDates.filter(date => date.rating > 7);
    const badDates = userDates.filter(date => date.rating < 4);

    // Find common elements in good dates
    if (goodDates.length > 1) {
      // Find common activities
      const activities = goodDates.map(date => date.activities).flat();
      const activityCount = activities.reduce((acc, act) => {
        acc[act] = (acc[act] || 0) + 1;
        return acc;
      }, {});

      // Find activities that appear in at least 50% of good dates
      Object.entries(activityCount).forEach(([activity, count]) => {
        if (count >= goodDates.length * 0.5) {
          patterns.successFactors.push(`${activity} dates tend to go well for you`);
        }
      });

      // Find ideal day of week
      const dayCount = goodDates.reduce((acc, date) => {
        const day = new Date(date.date).getDay();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

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

      // Find highest rated date types
      const dateTypes = goodDates.map(date => date.type);
      const typeCount = dateTypes.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      Object.entries(typeCount).forEach(([type, count]) => {
        if (count >= goodDates.length * 0.3) {
          patterns.highestRatedTypes.push(type);
        }
      });
    }

    // Find common red flags in bad dates
    if (badDates.length > 1) {
      const redFlags = badDates.map(date => date.redFlags).flat();
      const redFlagCount = redFlags.reduce((acc, flag) => {
        acc[flag] = (acc[flag] || 0) + 1;
        return acc;
      }, {});

      // Find red flags that appear in at least 30% of bad dates
      Object.entries(redFlagCount).forEach(([flag, count]) => {
        if (count >= badDates.length * 0.3) {
          patterns.redFlags.push(flag);
        }
      });
    }

    return patterns;
  };

  // Generate brutally honest insights
  const generateInsights = () => {
    const userDates = dates.filter(date => date.userId === currentUser);
    if (userDates.length < 3) {
      return ["You need more dating experience before I can give you useful insights. Get out there more."];
    }

    const insights = [];
    const patterns = identifyPatterns();
    const avgRating = userDates.reduce((sum, date) => sum + date.rating, 0) / userDates.length;
    
    // Overall dating success rate
    if (avgRating < 4) {
      insights.push("Your dating choices are consistently terrible. Consider therapy before dating more.");
    } else if (avgRating < 6) {
      insights.push("You're settling for mediocre dates. Raise your standards or improve yourself.");
    }

    // Red flag patterns
    if (patterns.redFlags && patterns.redFlags.length > 0) {
      insights.push(`You repeatedly ignore these red flags: ${patterns.redFlags.join(', ')}. Stop doing that.`);
    }

    // Dating frequency analysis
    const datesByMonth = userDates.reduce((acc, date) => {
      const month = new Date(date.date).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const maxDatesInMonth = Math.max(...Object.values(datesByMonth));
    if (maxDatesInMonth > 5) {
      insights.push("You're dating too frequently. Quantity over quality isn't working for you.");
    }

    // Consecutive bad dates
    let maxConsecutiveBadDates = 0;
    let currentStreak = 0;

    // Sort dates by date
    const sortedDates = [...userDates].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    for (const date of sortedDates) {
      if (date.rating < 4) {
        currentStreak++;
        maxConsecutiveBadDates = Math.max(maxConsecutiveBadDates, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    if (maxConsecutiveBadDates >= 3) {
      insights.push(`You had ${maxConsecutiveBadDates} bad dates in a row. Take a break and reassess your choices.`);
    }

    // Second date conversion rate
    const firstDates = userDates.filter(date => date.dateNumber === 1);
    const secondDates = userDates.filter(date => date.dateNumber === 2);
    
    if (firstDates.length > 0) {
      const conversionRate = (secondDates.length / firstDates.length) * 100;
      
      if (conversionRate < 30) {
        insights.push("Only " + conversionRate.toFixed(0) + "% of your first dates lead to second dates. You're either too picky or making terrible first impressions.");
      }
    }

    // Burnout warning
    if (burnoutLevel > 7) {
      insights.push("You're showing clear signs of dating burnout. Take a break for your mental health.");
    }

    // Add one positive insight if we have many negatives
    if (insights.length > 2 && patterns.successFactors && patterns.successFactors.length > 0) {
      insights.push(`One good thing: ${patterns.successFactors[0]}. Focus on this more.`);
    }

    return insights;
  };

  // Generate recommendations for personal growth
  const generateRecommendations = () => {
    const userDates = dates.filter(date => date.userId === currentUser);
    if (userDates.length < 3) {
      return ["Go on more dates before expecting useful recommendations."];
    }

    const recommendations = [];
    const patterns = identifyPatterns();
    
    // Recommendation based on ideal day of the week
    if (patterns.idealDayOfWeek) {
      recommendations.push(`Schedule more dates on ${patterns.idealDayOfWeek}s - they statistically work better for you.`);
    }

    // Recommendations based on highest rated date types
    if (patterns.highestRatedTypes && patterns.highestRatedTypes.length > 0) {
      recommendations.push(`Focus on these date types: ${patterns.highestRatedTypes.join(', ')}. They suit you better.`);
    }

    // Recommendations based on red flags
    if (patterns.redFlags && patterns.redFlags.length > 0) {
      recommendations.push(`Immediately end dates when you see these red flags: ${patterns.redFlags.join(', ')}. Stop wasting time.`);
    }

    // Recommendation based on burnout level
    if (burnoutLevel > 6) {
      recommendations.push("Take at least a month-long break from dating. Your judgment is compromised right now.");
    } else if (burnoutLevel > 3) {
      recommendations.push("Limit yourself to one date per week maximum until your burnout level decreases.");
    }

    // Add general recommendations
    recommendations.push("Be brutally honest with yourself about why past relationships ended.");
    recommendations.push("Stop looking for perfection. It doesn't exist, and neither do you.");

    return recommendations;
  };

  // Evaluate whether to pursue a relationship further
  const evaluateRelationship = (data) => {
    const { name, dates, redFlagCount, greenFlagCount, enjoymentLevel, values, burnoutIndicators } = data;
    
    // Check for Option D (taking a break) first
    if (burnoutLevel > 7 || burnoutIndicators > 3) {
      return {
        decision: "Option D: Take a Break",
        explanation: "You're showing signs of dating burnout. For your mental health, take a complete break from dating for at least a month.",
        recommendation: "Delete the dating apps, focus on friends and personal growth. Dating will be there when you're ready."
      };
    }

    // Calculate compatibility score
    let score = 0;
    score += enjoymentLevel * 2; // 0-20 points
    score += greenFlagCount * 3; // Variable points
    score -= redFlagCount * 5; // Variable negative points
    
    // Values compatibility (0-15 points)
    const valueCompatibility = Math.min(values, 5) * 3;
    score += valueCompatibility;
    
    // Number of dates factor
    score += Math.min(dates, 5) * 2; // 0-10 points

    // Too many red flags is an automatic no
    if (redFlagCount >= 3) {
      return {
        decision: "End It",
        explanation: `Despite any positives, ${name} has too many major red flags (${redFlagCount}). You're ignoring what your gut is telling you.`,
        recommendation: "Don't waste more time. End it clearly and directly."
      };
    }

    // Score-based decision
    if (score < 20) {
      return {
        decision: "End It",
        explanation: `The math doesn't lie. Your compatibility with ${name} is too low (score: ${score}/50).`,
        recommendation: "End it now before you invest more time in something that isn't working."
      };
    } else if (score < 35) {
      return {
        decision: "Proceed with Caution",
        explanation: `Your relationship with ${name} shows mixed signals (score: ${score}/50). It could work, but requires careful evaluation.`,
        recommendation: "Have a direct conversation about your concerns before investing more emotionally."
      };
    } else {
      return {
        decision: "Worth Pursuing",
        explanation: `The data suggests strong compatibility with ${name} (score: ${score}/50). This has potential.`,
        recommendation: "Continue investing in this relationship, but maintain awareness of any new red flags."
      };
    }
  };

  // Generate conversation starters based on shared interests
  const generateConversationStarters = (interests) => {
    if (!interests || interests.length === 0) {
      return ["You need to identify shared interests first. Pay more attention to what they talk about."];
    }

    const starters = [];
    
    // Generate two starters for each interest
    interests.forEach(interest => {
      switch(interest.toLowerCase()) {
        case 'travel':
          starters.push("If you could only travel to three more countries in your lifetime, which would you choose and why?");
          starters.push("What's the most underrated destination you've been to that more people should visit?");
          break;
        case 'food':
          starters.push("What's the most memorable meal you've ever had, and what made it special?");
          starters.push("If you had to eat the cuisine from one country for the rest of your life, which would you choose?");
          break;
        case 'movies':
        case 'film':
          starters.push("What movie do you think is totally overrated, and what would you recommend instead?");
          starters.push("If your life was a movie, which actor would play you and what genre would it be?");
          break;
        case 'music':
          starters.push("What concert do you wish you could have attended at any point in history?");
          starters.push("What song always puts you in a good mood, no matter what?");
          break;
        case 'books':
        case 'reading':
          starters.push("What book changed your perspective on something important?");
          starters.push("If you could have dinner with any author, dead or alive, who would it be and what would you ask them?");
          break;
        case 'sports':
          starters.push("What sport do you think takes the most overall athletic ability?");
          starters.push("If you could be professionally good at any sport, which would you choose?");
          break;
        case 'hiking':
        case 'outdoors':
          starters.push("What's the most breathtaking natural place you've ever been?");
          starters.push("If you could live in any national park for a month, which would you choose and why?");
          break;
        case 'art':
          starters.push("What type of art do you connect with most, and has that changed over time?");
          starters.push("If you could own any piece of art in the world, what would you choose?");
          break;
        case 'gaming':
        case 'video games':
          starters.push("What game world would you most want to live in, and what role would you have there?");
          starters.push("What older game do you think deserves a modern remake or sequel?");
          break;
        case 'technology':
          starters.push("What tech innovation do you think will most change daily life in the next decade?");
          starters.push("If you could uninvent one piece of technology, what would it be and why?");
          break;
        case 'science':
          starters.push("If you could instantly know the answer to one scientific mystery, what would you want to know?");
          starters.push("What scientific advancement are you most excited about or concerned about in our lifetime?");
          break;
        default:
          starters.push(`What first got you interested in ${interest}?`);
          starters.push(`What's something about ${interest} that most people don't appreciate or understand?`);
      }
    });

    // Add some general deep questions
    starters.push("What's something you've changed your mind about completely in the last few years?");
    starters.push("What are you currently trying to improve about yourself?");
    starters.push("What's something you're proud of that you don't get to talk about much?");

    // Return random selection of 5 starters
    return starters.sort(() => 0.5 - Math.random()).slice(0, 5);
  };

  // Generate date ideas based on shared preferences
  const generateDateIdeas = (preferences) => {
    if (!preferences || Object.keys(preferences).length === 0) {
      return ["You need to know their preferences before I can suggest personalized date ideas."];
    }

    const dateIdeas = [];
    const { activityLevel, budget, foodPreferences, interests } = preferences;

    // Generate ideas based on activity level
    if (activityLevel === 'high') {
      dateIdeas.push("Try an indoor rock climbing gym - it's active and lets you see how they handle challenges.");
      dateIdeas.push("Go hiking to a scenic spot and have a picnic at the destination.");
      if (budget === 'high') {
        dateIdeas.push("Book a kayaking or paddleboarding lesson followed by lunch at a waterfront restaurant.");
      }
    } else if (activityLevel === 'medium') {
      dateIdeas.push("Visit a museum or art gallery, then discuss your favorite pieces over coffee.");
      dateIdeas.push("Try a cooking class together focused on a cuisine you both enjoy.");
      if (budget === 'low') {
        dateIdeas.push("Find a free outdoor concert or movie in the park.");
      }
    } else { // low activity
      dateIdeas.push("Have a board game night at a cozy café with good desserts.");
      dateIdeas.push("Go to a comedy show - you'll learn about their sense of humor.");
      if (budget === 'high') {
        dateIdeas.push("Book a wine tasting at a vineyard with a scenic setting.");
      }
    }

    // Add food-related ideas based on preferences
    if (foodPreferences && foodPreferences.length > 0) {
      const cuisine = foodPreferences[Math.floor(Math.random() * foodPreferences.length)];
      dateIdeas.push(`Find a highly-rated ${cuisine} restaurant neither of you has tried before.`);
      
      if (budget === 'low') {
        dateIdeas.push(`Cook a simple ${cuisine} meal together at home - it's intimate and shows effort without spending much.`);
      }
    }

    // Add interest-based ideas
    if (interests && interests.length > 0) {
      interests.forEach(interest => {
        switch(interest.toLowerCase()) {
          case 'music':
            dateIdeas.push("Find a small live music venue featuring a genre you both enjoy.");
            break;
          case 'art':
            dateIdeas.push("Visit a local gallery opening - they often have free wine and interesting people.");
            break;
          case 'books':
            dateIdeas.push("Explore a used bookstore and buy each other a book you think they'd enjoy.");
            break;
          case 'nature':
            dateIdeas.push("Visit a botanical garden or arboretum and find a quiet spot to talk.");
            break;
          case 'film':
          case 'movies':
            dateIdeas.push("Instead of mainstream cinema, find an independent theater showing something unique.");
            break;
        }
      });
    }

    // Add one unexpected idea
    dateIdeas.push("Try something completely different: a ghost tour, axe throwing, or a pottery class. Novel experiences create stronger memories.");

    // Return random selection of ideas
    return dateIdeas.sort(() => 0.5 - Math.random()).slice(0, 5);
  };

  // Get leaderboard data
  const getLeaderboards = () => {
    const boards = {
      mostDates: Object.entries(socialStats.dateCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, value: count })),
      
      highestRatings: Object.entries(socialStats.avgRatings)
        .sort((a, b) => b[1] - a[1])
        .map(([name, rating]) => ({ name, value: rating })),
      
      successRates: Object.entries(socialStats.successRates)
        .sort((a, b) => b[1] - a[1])
        .map(([name, rate]) => ({ name, value: rate })),
      
      dateVariety: Object.entries(socialStats.dateVariety)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, value: count })),

      lowestBurnout: Object.entries(socialStats.burnoutLevels)
        .sort((a, b) => a[1] - b[1])
        .map(([name, level]) => ({ name, value: level }))
    };

    return boards;
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allProfiles,
        dates,
        assessments,
        goals,
        burnoutLevel,
        socialStats,
        switchUser,
        addDate,
        addAssessment,
        addGoal,
        completeGoal,
        updateBurnoutLevel,
        identifyPatterns,
        generateInsights,
        generateRecommendations,
        evaluateRelationship,
        generateConversationStarters,
        generateDateIdeas,
        getLeaderboards
      }}
    >
      {children}
    </UserContext.Provider>
  );
};