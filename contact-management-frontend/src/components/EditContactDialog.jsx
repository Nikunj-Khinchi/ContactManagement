import { useState } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Alert,
} from "@mui/material";
import { updateContact } from "../apis/api";

const EditContactDialog = ({ open, onClose, contact, onContactUpdated }) => {
    const [formData, setFormData] = useState({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
        company: contact.company,
        jobTitle: contact.jobTitle,
    });

    const [error, setError] = useState(null); // State to hold error messages

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null); // Clear previous errors
        try {
            await updateContact(contact._id, formData);
            onContactUpdated(); // Refresh the contact list
            onClose(); // Close the dialog
        } catch (err) {
            // Set the error message
            const errorMessage = err.response?.data?.message || "Error updating contact";
            setError(errorMessage);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogContent>
                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Form Fields */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <TextField
                        name="firstName"
                        label="First Name"
                        fullWidth
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="email"
                        label="Email"
                        fullWidth
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="phoneNumber"
                        label="Phone Number"
                        fullWidth
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        error={formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)}
                        helperText={formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber) ? "Phone number must be 10 digits" : ""}
                        inputProps={{ maxLength: 10 }}
                    />
                    <TextField
                        name="company"
                        label="Company"
                        fullWidth
                        value={formData.company}
                        onChange={handleChange}
                    />
                    <TextField
                        name="jobTitle"
                        label="Job Title"
                        fullWidth
                        value={formData.jobTitle}
                        onChange={handleChange}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

EditContactDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    contact: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        company: PropTypes.string,
        jobTitle: PropTypes.string,
    }).isRequired,
    onContactUpdated: PropTypes.func.isRequired,
};

export default EditContactDialog;
