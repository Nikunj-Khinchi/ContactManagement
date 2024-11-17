#!/bin/bash

# Navigate to the backend directory and start the backend service
echo "Starting backend service..."
cd contact-management-backend
npm start &

# Navigate to the frontend directory and start the frontend service
echo "Starting frontend service..."
cd ../contact-management-frontend
npm run dev &

# Wait for both services to exit
wait