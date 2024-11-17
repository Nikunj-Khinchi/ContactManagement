import { useState } from "react";
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import ContactForm from "./components/ContactForm";
import ContactsTable from "./components/ContactsTable";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh); // Toggle refresh state to reload table
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" marginTop={2} gutterBottom>
        Contact Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDialogOpen}
        style={{ marginBottom: 16 }}
      >
        Add Contact
      </Button>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <ContactForm
            onContactAdded={() => {
              handleRefresh();
              handleDialogClose();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      
      <ContactsTable key={refresh} />
    </Container>
  );
}

export default App;
