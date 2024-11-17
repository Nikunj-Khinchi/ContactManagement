# Contact Management System

This project is a **Contact Management System** built using **React.js** on the frontend and **Node.js** on the backend. The application provides features to manage contacts, including adding, editing, deleting, and sorting contacts. The project is styled using Material-UI (MUI) components for a clean and responsive user interface.

---

## Features

### Frontend Features
1. **Contact Table**:
   - Displays all contacts with pagination.
   - Options to edit or delete individual contacts.
   - Sort functionality (optional) to sort contacts based on different fields like name, email, etc.

2. **Add Contact**:
   - A form to add new contacts with fields like `First Name`, `Last Name`, `Email`, `Phone Number`, `Company`, and `Job Title`.
   - Displays error messages above the form in case of validation or API errors.

3. **Edit Contact**:
   - Allows updating the details of existing contacts via a dialog.
   - Proper error handling for API errors.

4. **Delete Contact**:
   - Provides a confirmation dialog before deleting a contact.

5. **Sorting**:
   - Sorting is optional.
   - The dropdown defaults to **"Select an option"**. When selected, it sorts based on the chosen field in ascending or descending order.
   - If no sorting is selected, the contacts appear in the default order (latest contacts on top).

6. **Error Handling**:
   - Errors from API responses are displayed on the UI instead of alert boxes, enhancing the user experience.

### Backend Features
The backend is built with **Node.js** and provides the following functionalities:
   - **CRUD Operations** for managing contacts:
     - **Create**: Add a new contact.
     - **Read**: Fetch paginated and sorted contacts.
     - **Update**: Edit an existing contact's details.
     - **Delete**: Remove a contact from the database.

   - **Sorting and Pagination**:
     - Server-side implementation for sorting and pagination to ensure scalability.

   - **Validation**:
     - API routes validate the data to ensure proper formatting before database interaction.

---

## Technologies Used

### Frontend
- **React.js**: Component-based architecture for building a responsive user interface.
- **Material-UI (MUI)**: Used for UI components and styling.
- **Axios**: For making API requests.

### Backend
- **Node.js**: Backend runtime.
- **Express.js**: Framework for building REST APIs.
- **MongoDB**: Database for storing contacts.
- **Mongoose**: ODM library for MongoDB.

---

## Setup Instructions

### Prerequisites
- Node.js and npm installed.
- MongoDB running locally or on the cloud.
### Setup

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```

2. Navigate to the root directory of the project:
    ```sh
    cd contact-management-backend
    ```

3. Add the `.env` file with the following content:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/contact-manager
    ```   

### Running Both Services

1. Navigate to the root directory of the project.

2. Install the dependencies for both backend and frontend:
    ```sh
    ./dependencies.sh
    ```
3. Run the `runner.sh` script to start both backend and frontend services:
    ```sh
    ./runner.sh
    ```