# Manual Setup and Start Guide for Pawnshop Management App

This guide will walk you through setting up and starting the Pawnshop Management Application manually (without Docker).

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js and npm:** [Download and Install Node.js](https://nodejs.org/en/download/)
*   **MySQL Server:** [Download and Install MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## 1. Backend Setup (Node.js/Express)

1.  **Navigate to the Backend Directory**
    *   Open your terminal or command prompt.
    *   Navigate to the `backend` directory of the project:
        ```bash
        cd D:\projects\pawn_app\backend
        ```

2.  **Install Dependencies**
    *   Install the Node.js dependencies:
        ```bash
        npm install
        ```

3.  **Database Configuration (.env)**
    *   Go to the project's root directory (`D:\projects\pawn_app`).
    *   Ensure you have a `.env` file with your MySQL database credentials. If not, create one with the following content, replacing the placeholder values with your actual MySQL root password and desired database name:
        ```
        PORT=3000
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_mysql_root_password
        DB_NAME=pawnshop_db
        JWT_SECRET=supersecretjwtkey
        ```

4.  **Create MySQL Database**
    *   Log in to your MySQL server (e.g., using MySQL Workbench, MySQL Shell, or the command line).
    *   Create the database specified in your `.env` file (e.g., `pawnshop_db`):
        ```sql
        CREATE DATABASE pawnshop_db;
        ```

5.  **Run Sequelize Migrations**
    *   From the `backend` directory, run the migrations to create the necessary tables in your database:
        ```bash
        npx sequelize-cli db:migrate
        ```

6.  **Start the Backend Server**
    *   From the `backend` directory, start the server:
        ```bash
        npm start
        ```
    *   The backend API will be running at `http://localhost:3000`.

## 2. Frontend Setup (Vue.js/Vite)

1.  **Navigate to the Frontend Directory**
    *   Open a **new** terminal or command prompt window.
    *   Navigate to the `frontend` directory of the project:
        ```bash
        cd D:\projects\pawn_app\frontend
        ```

2.  **Install Dependencies**
    *   Install the Node.js dependencies:
        ```bash
        npm install
        ```

3.  **Start the Frontend Development Server**
    *   From the `frontend` directory, start the development server:
        ```bash
        npm run dev
        ```
    *   The frontend application will be accessible in your web browser at `http://localhost:5173`. API requests will be proxied to `http://localhost:3000`.

## Troubleshooting

*   **Backend `MODULE_NOT_FOUND`:** Ensure you ran `npm install` in the `backend` directory.
*   **Frontend `MODULE_NOT_FOUND`:** Ensure you ran `npm install` in the `frontend` directory.
*   **Database Connection Issues:** Double-check your `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in the `.env` file. Ensure your MySQL server is running and accessible from `localhost`.
*   **Port Conflicts:** If you encounter issues with ports (e.g., `port is already in use`), ensure no other applications are using ports `3000` or `8080` on your machine.