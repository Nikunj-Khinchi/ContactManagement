const Joi = require("joi");
const Contact = require("../models/contactModel");
const logger = require("../utils/logger");
const WriteResponse = require("../utils/response");

// Validation schema
const contactValidationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    company: Joi.string().optional(),
    jobTitle: Joi.string().optional(),
});

// Controller to add a new contact
const createContact = async (req, res) => {
    const { error } = contactValidationSchema.validate(req.body);
    if (error) {
        logger.error(`Validation error: ${error.details[0].message}`);
        return WriteResponse(res, 400, error.details[0].message);
    }
    try {
        // phone number validation using regex for 10 digits
        if (!/^\d{10}$/.test(req.body.phoneNumber)) {
            logger.error("Phone number should be exactly 10 digits");
            return WriteResponse(res, 400, "Phone number should be exactly 10 digits");
        }
        // Check for duplicates by email or phone number
        const existingContact = await Contact.findOne({
            $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
        });

        if (existingContact) {
            const duplicateField =
                existingContact.email === req.body.email ? "email" : "phone number";

            logger.warn(`Duplicate ${duplicateField} detected`);
            return WriteResponse(res, 400, `${duplicateField} already exists`);
        }

        // Create new contact if no duplicates found
        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();

        logger.info(`Contact created: ${savedContact._id}`);
        return WriteResponse(
            res,
            201,
            "Contact created successfully",
            savedContact
        );
    } catch (err) {
        logger.error(`Error creating contact: ${err.message}`);
        return WriteResponse(res, 500, err.message);
    }
};

const getAllContacts = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "",
    } = req.query;

    try {
        // Parse pagination parameters
        const currentPage = parseInt(page, 10);
        const currentLimit = parseInt(limit, 10);

        // Get total count of contacts
        const totalCount = await Contact.countDocuments();

        // Validate the page parameter
        if (currentPage < 1 || currentPage > Math.ceil(totalCount / currentLimit)) {
            throw new Error("Invalid page");
        }

        // Retrieve paginated contacts
        const contacts = await Contact.find()
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip((currentPage - 1) * currentLimit)
            .limit(currentLimit);

        // Construct response
        const response = {
            contacts,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(totalCount / currentLimit),
            totalCount,
        };

        logger.info("Contacts retrieved successfully");
        return WriteResponse(res, 200, "Contacts retrieved successfully", response);
    } catch (err) {
        logger.error(`Error retrieving contacts: ${err.message}`);
        return WriteResponse(res, 500, err.message);
    }
};

module.exports = {
    getAllContacts,
};

const updateContactById = async (req, res) => {
    const { error } = contactValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, phoneNumber } = req.body;


    try {

        if (!/^\d{10}$/.test(phoneNumber)) {
            logger.error("Phone number should be exactly 10 digits");
            return WriteResponse(res, 400, "Phone number should be exactly 10 digits");
        }

        const existingContact = await Contact.findOne({
            $or: [{ email }, { phoneNumber }],
            _id: { $ne: req.params.id },
        });


        if (existingContact) {
            const isDuplicateEmail = existingContact.email === email;
            const isDuplicatePhone = existingContact.phoneNumber === phoneNumber;

            if (isDuplicateEmail || isDuplicatePhone) {
                const duplicateField = isDuplicateEmail ? 'email' : 'phone';
                logger.warn(`Duplicate ${duplicateField} detected`);
                return WriteResponse(res, 400, `${duplicateField} already exists`);
            }
        }


        // Proceed with updating the contact
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedContact) {
            logger.error("Contact not found");
            return WriteResponse(res, 404, "Contact not found");
        }

        logger.info("Contact updated successfully");
        return WriteResponse(
            res,
            200,
            "Contact updated successfully",
            updatedContact
        );
    } catch (err) {
        logger.error(`Error updating contact: ${err}`);
        return WriteResponse(res, 500, err.message);
    }
};

// Controller to delete a contact
const deleteContactById = async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) {
            logger.error("Contact not found");
            return res.status(404).json({ error: "Contact not found" });
        }
        logger.info("Contact deleted successfully");
        return WriteResponse(res, 200, "Contact deleted successfully", deletedContact);
    } catch (err) {
        logger.error(`Error deleting contact: ${err.message}`);
        return WriteResponse(res, 500, err.message);
    }
};

module.exports = {
    createContact,
    getAllContacts,
    updateContactById,
    deleteContactById,
};
