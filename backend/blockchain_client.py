"""
blockchain_client.py — KScouts Blockchain Integration

Connects to the CertificateRegistry smart contract.
Used by the certificate upload endpoint to store hashes on-chain.

For LOCAL testing: uses Hardhat local node (http://127.0.0.1:8545)
For PRODUCTION: set BLOCKCHAIN_RPC_URL (Sepolia) and WALLET_PRIVATE_KEY in .env
"""

import os
import json
import hashlib
from pathlib import Path
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# ──────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────

# RPC URL — defaults to local Hardhat node
RPC_URL = os.getenv("BLOCKCHAIN_RPC_URL", "http://127.0.0.1:8545")

# Contract address (set after deployment)
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")

# Wallet private key (Hardhat Account #0 key for local testing)
PRIVATE_KEY = os.getenv(
    "WALLET_PRIVATE_KEY",
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"  # Hardhat Account #0 (local only!)
)

# Path to ABI file (saved by deploy script)
ABI_PATH = Path(__file__).parent.parent / "blockchain" / "abi" / "CertificateRegistry.json"

# ──────────────────────────────────────────────
# INIT
# ──────────────────────────────────────────────

def _load_contract():
    """Load the contract from ABI file and connect to blockchain."""
    try:
        w3 = Web3(Web3.HTTPProvider(RPC_URL))
        if not w3.is_connected():
            print(f"⚠️  Blockchain: Cannot connect to {RPC_URL}")
            return None, None

        if not ABI_PATH.exists():
            print(f"⚠️  Blockchain: ABI file not found at {ABI_PATH}")
            return None, None

        with open(ABI_PATH) as f:
            data = json.load(f)

        address = CONTRACT_ADDRESS or data.get("address", "")
        if not address:
            print("⚠️  Blockchain: CONTRACT_ADDRESS not set")
            return None, None

        contract = w3.eth.contract(
            address=Web3.to_checksum_address(address),
            abi=data["abi"]
        )
        return w3, contract

    except Exception as e:
        print(f"⚠️  Blockchain init error: {e}")
        return None, None


# ──────────────────────────────────────────────
# PUBLIC FUNCTIONS
# ──────────────────────────────────────────────

def verify_certificate_hash(sha256_hex: str) -> dict:
    """
    Verify a certificate hash on-chain (Strictly Read-Only).

    Returns:
        dict with keys: verified (bool), message (str)
    """
    w3, contract = _load_contract()
    if not w3 or not contract:
        return {"verified": False, "message": "Blockchain unavailable"}

    try:
        # The frontend provides the hex string without 0x prefix, or with it.
        if sha256_hex.startswith("0x"):
            sha256_hex = sha256_hex[2:]
            
        hash_bytes = bytes.fromhex(sha256_hex)
        hash_bytes32 = hash_bytes.ljust(32, b'\x00')[:32]

        is_verified = contract.functions.verifyCertificate(hash_bytes32).call()
        
        if is_verified:
            return {
                "verified": True,
                "message": "Certificate verified on blockchain"
            }
        else:
            return {
                "verified": False,
                "message": "Certificate not found in blockchain registry"
            }
            
    except Exception as e:
        print(f"❌ Blockchain verify error: {e}")
        return {"verified": False, "message": f"Verification error: {str(e)}"}


def is_blockchain_available() -> bool:
    """Quick check if the blockchain node is accessible."""
    try:
        w3 = Web3(Web3.HTTPProvider(RPC_URL))
        return w3.is_connected()
    except:
        return False
