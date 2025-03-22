const express = require('express');
const router = express.Router();
const { 
  createContact, 
  getContacts, 
  getContactById, 
  updateContact, 
  deleteContact 
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .post(createContact)
  .get(getContacts);

router.route('/:id')
  .get(getContactById)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;