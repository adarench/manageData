const { Contact, Date } = require('../models');

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res) => {
  const { name, phoneNumber, tags, notes } = req.body;

  const contactExists = await Contact.findOne({
    where: { 
      name, 
      userId: req.user.id 
    }
  });

  if (contactExists) {
    res.status(400);
    throw new Error('Contact with this name already exists');
  }

  const contact = await Contact.create({
    name,
    phoneNumber,
    tags: tags || [],
    notes,
    userId: req.user.id,
    status: 'new'
  });

  res.status(201).json(contact);
};

// @desc    Get all user's contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
  const filter = { userId: req.user.id };
  
  // Apply status filter if provided
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Apply tag filter if provided
  if (req.query.tag) {
    filter.tags = {
      [Op.contains]: [req.query.tag]
    };
  }

  // Apply search query if provided
  if (req.query.search) {
    filter.name = {
      [Op.iLike]: `%${req.query.search}%`
    };
  }

  const contacts = await Contact.findAll({
    where: filter,
    order: [['name', 'ASC']],
    include: [
      {
        model: Date,
        as: 'dates',
        attributes: ['id', 'dateTime', 'status', 'rating'],
        limit: 1,
        order: [['dateTime', 'DESC']]
      }
    ]
  });

  res.json(contacts);
};

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = async (req, res) => {
  const contact = await Contact.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    },
    include: [
      {
        model: Date,
        as: 'dates',
        order: [['dateTime', 'DESC']]
      }
    ]
  });

  if (contact) {
    res.json(contact);
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
  const contact = await Contact.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  });

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  contact.name = req.body.name || contact.name;
  contact.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : contact.phoneNumber;
  contact.status = req.body.status || contact.status;
  contact.tags = req.body.tags || contact.tags;
  contact.notes = req.body.notes !== undefined ? req.body.notes : contact.notes;

  const updatedContact = await contact.save();

  res.json(updatedContact);
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  const contact = await Contact.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  });

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  // Check if contact has dates
  const dateCount = await Date.count({
    where: { contactId: contact.id }
  });

  if (dateCount > 0) {
    res.status(400);
    throw new Error('Cannot delete contact with associated dates. Delete the dates first or update the contact instead.');
  }

  await contact.destroy();

  res.json({ message: 'Contact removed' });
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
};