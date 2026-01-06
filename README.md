# PhysioSim - Medical Case Simulator

A full-stack web application for medical students to practice clinical cases.

## Features
- Interactive medical cases with MCQ, history, and investigations.
- Admin dashboard for case and user management.
- Leaderboard and user profiles.
- Membership system.

## Tech Stack
- **Frontend**: React (Vite), Vanilla CSS.
- **Backend**: Node.js (Express), MySQL.
- **Deployment**: GitHub + Railway.

## Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd PhysioSim
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root based on `.env.example`.

4. **Run the application**:
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:4000
   - Frontend: http://localhost:5173

## Deployment to Railway

1. **Push your code to GitHub**.
2. **Create a new project on Railway**.
3. **Add a MySQL database** to your Railway project.
4. **Connect your GitHub repository** to Railway.
5. **Configure Environment Variables** in Railway:
   - `JWT_SECRET`: A random string.
   - `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLPORT`, `MYSQLDATABASE`: These are automatically provided by the Railway MySQL service.
6. **Build & Start**:
   Railway will automatically detect the root `package.json` and run:
   - Build command: `npm run build`
   - Start command: `npm run start`

## Project Structure
- `/frontend`: React application.
- `/backend`: Express API.
- `/package.json`: Root configuration for monorepo management.
