import { useState, useEffect, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TablePagination,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { getContacts, deleteContact } from "../apis/api";
import EditContactDialog from "./EditContactDialog";

const ContactsTable = () => {
    const [contacts, setContacts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    const [selectedContact, setSelectedContact] = useState(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
    const [contactToDelete, setContactToDelete] = useState(null); // The contact to be deleted

    const [sortBy, setSortBy] = useState(""); // Default: no sorting
    const [order, setOrder] = useState("asc"); // Default order

    const fetchContacts = useCallback(async () => {
        try {
            const params = {
                page: page + 1,
                limit: rowsPerPage,
            };

            // Include sorting parameters only if sortBy is not empty
            if (sortBy) {
                params.sortBy = sortBy;
                params.order = order;
            }

            const response = await getContacts(params);
            const { contacts, totalCount } = response.data.data;
            setContacts(contacts);
            setTotalCount(totalCount);
        } catch (err) {
            console.error(err.message);
        }
    }, [page, rowsPerPage, sortBy, order]);

    useEffect(() => {
        fetchContacts();
    }, [page, rowsPerPage, sortBy, order, fetchContacts]);

    const handleDelete = async () => {
        try {
            if (contactToDelete) {
                await deleteContact(contactToDelete._id);
                fetchContacts(); // Refresh the list
                setDeleteDialogOpen(false); // Close the dialog
                setContactToDelete(null); // Clear the selected contact
            }
        } catch (err) {
            alert(err.response?.data?.message || "Error deleting contact");
        }
    };

    const handleEdit = (contact) => {
        setSelectedContact(contact);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedContact(null);
    };

    const handleDeleteDialogOpen = (contact) => {
        setContactToDelete(contact);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setContactToDelete(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortBy(value);
        if (value === "") {
            setOrder("asc"); // Reset order to default when no sorting is applied
        }
    };

    const handleOrderChange = (event) => {
        setOrder(event.target.value);
    };

    return (
        <Box p={2}>
            {/* Sorting Options */}
            <Box display="flex" justifyContent="flex-end" mb={2} gap={2}>
                <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id="sort-by-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-by-label"
                        value={sortBy}
                        onChange={handleSortChange}
                        label="Sort By"
                    >
                        <MenuItem value="">
                            <em>Select an option</em>
                        </MenuItem>
                        <MenuItem value="firstName">First Name</MenuItem>
                        <MenuItem value="lastName">Last Name</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="phoneNumber">Phone Number</MenuItem>
                        <MenuItem value="company">Company</MenuItem>
                        <MenuItem value="jobTitle">Job Title</MenuItem>
                    </Select>
                </FormControl>

                {/* Order Option */}
                {sortBy && (
                    <FormControl size="small" variant="outlined">
                        <InputLabel>Order</InputLabel>
                        <Select
                            value={order}
                            onChange={handleOrderChange}
                            label="Order"
                        >
                            <MenuItem value="asc">Asc</MenuItem>
                            <MenuItem value="desc">Desc</MenuItem>
                        </Select>
                    </FormControl>
                )}
            </Box>

            {/* Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Job Title</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <TableRow key={contact._id}>
                                    <TableCell>{contact.firstName}</TableCell>
                                    <TableCell>{contact.lastName}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.phoneNumber}</TableCell>
                                    <TableCell>{contact.company}</TableCell>
                                    <TableCell>{contact.jobTitle}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEdit(contact)}
                                            style={{ marginRight: 15 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteDialogOpen(contact)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No contacts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Edit Contact Dialog */}
            {selectedContact && (
                <EditContactDialog
                    open={isEditDialogOpen}
                    onClose={handleCloseEditDialog}
                    contact={selectedContact}
                    onContactUpdated={fetchContacts}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this contact?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ContactsTable;
