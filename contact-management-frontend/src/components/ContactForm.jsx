import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Box, Alert } from "@mui/material";
import { createContact } from "../apis/api";

const ContactForm = ({ contact, onContactAdded, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    jobTitle: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (contact) setFormData(contact);
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    try {

      await createContact(formData);
      onContactAdded(); // Refresh the contact list
      onClose(); // Close the form/dialog
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error saving contact";
      setError(errorMessage);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Form Fields */}
      <TextField
        name="firstName"
        label="First Name"
        fullWidth
        value={formData.firstName || ""}
        onChange={handleChange}
        required
        margin="dense"
      />

      <TextField
        name="lastName"
        label="Last Name"
        fullWidth
        value={formData.lastName || ""}
        onChange={handleChange}
        required
        margin="dense"
      />

      <TextField
        name="email"
        label="Email"
        type="email"
        fullWidth
        value={formData.email || ""}
        required
        margin="dense"
        onChange={handleChange}
      />
      <TextField
        name="phoneNumber"
        label="Phone Number"
        fullWidth
        type="tel"
        value={formData.phoneNumber || ""}
        onChange={handleChange}
        required
        margin="dense"
        error={formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)}
        helperText={
          formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)
            ? "Phone number must be 10 digits"
            : ""
        }
        inputProps={{ maxLength: 10 }}
      />

      <TextField
        name="company"
        label="Company"
        fullWidth
        value={formData.company || ""}
        onChange={handleChange}
        margin="dense"
      />

      <TextField
        name="jobTitle"
        label="Job Title"
        fullWidth
        value={formData.jobTitle || ""}
        onChange={handleChange}
        margin="dense"
      />

      {/*       
      /* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 16 }}
      >
        {contact ? "Update Contact" : "Add Contact"}
      </Button>
    </Box>
  );
};

ContactForm.propTypes = {
  contact: PropTypes.object,
  onContactAdded: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ContactForm;
