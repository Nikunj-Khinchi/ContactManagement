const express = require('express');
const contactController = require('../controller/contactController');
const router = express.Router();

router.post('/', contactController.createContact);
router.get('/', contactController.getAllContacts);
router.put('/:id', contactController.updateContactById);
router.delete('/:id', contactController.deleteContactById);

module.exports = router;
