const express = require('express');
const router = express.Router();
const { 
  addDate, 
  getDates, 
  getDateById, 
  updateDate, 
  deleteDate,
  getDateInsights
} = require('../controllers/dateController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .post(addDate)
  .get(getDates);

router.get('/insights', getDateInsights);

router.route('/:id')
  .get(getDateById)
  .put(updateDate)
  .delete(deleteDate);

module.exports = router;