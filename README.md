# KScouts Football Scouting Platform

A modernized platform connecting young football prospects with scouts and clubs. 
KScouts features an instant certificate verification system backed by the Polygon blockchain to prevent fraud and validate player trials.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Blockchain**: Solidity, Web3.py, Hardhat (Local testing) / Polygon Mumbai (Production)

---

## 🚀 Setup Instructions

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **Python** (3.12+ recommended)
- **PostgreSQL** Database server running locally

### 2. Database Setup
Create an empty PostgreSQL database named `kscouts`.
```sql
CREATE DATABASE kscouts;
```

### 3. Backend Setup
1. Open a terminal in the `backend/` folder.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```
5. Run the FastAPI server:
   ```bash
   python main.py
   ```
   *The backend will be available at `http://127.0.0.1:8000`. API docs at `/docs`.*

### 4. Frontend Setup
1. Open a terminal in the `frontend/` folder.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

### 5. Blockchain Setup (Optional for Testing)
KScouts uses an instant blockchain validation system. If you want to test uploading verified certificates locally:
1. Open a terminal in the `blockchain/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start a local Hardhat node:
   ```bash
   npx hardhat node
   ```
4. In another terminal in the `blockchain/` folder, deploy the smart contract:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
5. Copy the newly generated `CONTRACT_ADDRESS` from the terminal output into your `backend/.env` file. Restart your backend server (`python main.py`).

## ⚠️ Notes
- The default demo certificates (`demo_certificate.pdf`, etc.) have their SHA-256 hashes hardcoded into the `backend/.env` or `blockchain_client.py`/`deploy.js` scripts based on the local environment for testing functionality.
- Do NOT expose `PRIVATE_KEY` or `WALLET_PRIVATE_KEY` in production.
