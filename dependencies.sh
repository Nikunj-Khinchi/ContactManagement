#!/bin/bash

# Navigate to the backend directory and install dependencies
echo "Installing backend dependencies..."
cd contact-management-backend
npm install

# Navigate to the frontend directory and install dependencies
echo "Installing frontend dependencies..."
cd ../contact-management-frontend
npm install

echo "Dependencies installed successfully for both backend and frontend."