# KScouts: Football Scouting & Certificate Verification Platform

> **Blockchain-based football scouting and certificate verification platform**

![KScouts Banner](frontend/public/kscouts_logo.png) <!-- Update with actual banner if available -->

KScouts is a modern platform connecting young football prospects with scouts, academies, and clubs. To prevent fraud and validate player trial attendance, KScouts features a **manual certificate upload with SHA-256 hash anchoring on Polygon for public verification.**

## 📋 Table of Contents
1. [Problem Statement](#-problem-statement)
2. [Key Features](#-key-features)
3. [System Roles](#-system-roles)
4. [Tech Stack](#-tech-stack)
5. [System Architecture](#-system-architecture)
6. [Certificate Verification Flow](#-certificate-verification-flow)
7. [Screenshots](#-screenshots)
8. [Local Development Setup](#%EF%B8%8F-local-development-setup)
9. [Testnet Setup (Polygon Amoy)](#-testnet-setup-polygon-amoy)
10. [Deployment Guide](#-deployment-guide)
11. [Known Limitations](#-known-limitations)

---

## 🎯 Problem Statement
In grassroots and youth football, players often struggle to prove they attended exclusive trials or achieved specific ratings. Paper certificates are easily forged, and scouts lack a centralized, trustworthy way to verify a player's claims. 

KScouts solves this by assigning every official achievement certificate a unique digital fingerprint (SHA-256 hash) that is securely anchored to a public blockchain, ensuring absolute immutability and instant verification while keeping the heavy application data on a fast, traditional database.

---

## ✨ Key Features
- **User Authentication:** Secure login for Players, Clubs, and Admins.
- **Player Profiles:** Detailed player metrics including position, height, weight, and history.
- **Event Management:** Clubs can create and manage scouting trials/events.
- **Application System:** Players can apply to events, and clubs can review applicants.
- **Blockchain Verification:** A zero-trust certificate verification system backed by smart contracts.

---

## 👥 System Roles
1. **Player:** Can view events, apply for trials, upload official certificates to their profile, and share their verified status.
2. **Club / Scout:** Can create events, review applicant profiles, and verify the authenticity of a player's uploaded certificates.
3. **Admin:** Controls the blockchain registry, generating and anchoring legitimate certificate hashes to the network.

---

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Python-dotenv
- **Blockchain**: Solidity, Web3.py, Hardhat (Local testing) / Polygon Amoy (Testnet)

---

## 🏗 System Architecture
KScouts uses a hybrid architecture for maximum efficiency and cost-effectiveness:
- **PostgreSQL (Database):** Stores all traditional application data (user accounts, player stats, event details, and application states).
- **Blockchain (Polygon Amoy):** Strictly stores **only** the 64-character SHA-256 hashes of officially issued certificates. No raw files or personal data are stored on-chain, keeping gas costs minimal and privacy intact.

---

## 🔗 Certificate Verification Flow
1. **Issuance (Off-chain):** An administrator uses `generate_demo_certificate.py` to create a PDF certificate for a player.
2. **Anchoring (On-chain):** The script computes the SHA-256 hash of the PDF and sends a transaction to the `CertificateRegistry` smart contract on Polygon Amoy to permanently store the hash.
3. **Upload (Off-chain):** The player uploads their PDF certificate to their KScouts profile.
4. **Verification (Hybrid):** The FastAPI backend intercepts the file, hashes it locally, and queries the blockchain. If the hash exists in the smart contract registry, the certificate is instantly marked as **Verified** ✅ in the database.

---

## 📸 Screenshots
*(Add real screenshot links here before submission)*
- [Login / Registration Flow](#)
- [Player Dashboard & Profile](#)
- [Event Creation & Application Page](#)
- [Notification System](#)
- [Certificate Verification Badge](#)

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **Python** (3.12+ recommended)
- **PostgreSQL** Database running locally

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
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and fill it in:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost/kscouts
   SECRET_KEY=your_secret_key_here
   BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
   CONTRACT_ADDRESS=your_deployed_contract_address
   WALLET_PRIVATE_KEY=your_wallet_private_key
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### 4. Frontend Setup
1. Open a terminal in the `frontend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file for the frontend:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the Vite server:
   ```bash
   npm run dev
   ```

### 5. Local Blockchain Setup (Hardhat)
To test certificate verification completely locally:
1. Open a terminal in the `blockchain/` folder and run `npm install`.
2. Start the local node: `npx hardhat node`.
3. In a new terminal, deploy the contract: `npx hardhat run scripts/deploy.js --network localhost`.
4. Copy the logged `CONTRACT_ADDRESS` into your `backend/.env` file.

---

## 🌐 Testnet Setup (Polygon Amoy)
For a live presentation, KScouts should be pointed to the live Polygon Amoy test network.

1. Get an API key from an RPC provider (e.g., Alchemy or Infura) for the Polygon Amoy network.
2. Ensure your administrator wallet has Amoy test MATIC (from a faucet).
3. Update `blockchain/hardhat.config.js` to include the Amoy network credentials.
4. Deploy to Amoy: `npx hardhat run scripts/deploy.js --network amoy`.
5. Update your backend `.env`:
   ```env
   BLOCKCHAIN_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY
   CONTRACT_ADDRESS=your_amoy_contract_address
   ```

---

## 🚀 Deployment Guide

### Backend (Render)
1. Create a New Web Service on Render and link this repository.
2. Root Directory: `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add all `.env` variables from your local setup (using remote PostgreSQL and Amoy credentials).

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Root Directory: `frontend`
3. Framework Preset: `Vite`
4. Add Environment Variable: `VITE_API_URL` pointing to your deployed Render backend URL.

---

## ⚠️ Known Limitations
- The admin backend is currently minimal; generating robust statistics and manual user override features are future scope additions.
- The blockchain is strictly used to anchor certificate hashes. It does not store user profiles or monetary transactions.
- Certificate generation is currently triggered manually by admins via a Python script (`generate_demo_certificate.py`), not yet automated through an admin GUI. 
- Local blockchain testing works natively via Hardhat; live testnet deployment requires configuration over Polygon Amoy.

---
*Built with ❤️ for grassroots football development.*
