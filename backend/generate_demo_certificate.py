"""
generate_test_cert.py
Generates new test certificate PDFs for multiple players, prints their SHA-256 hashes,
and stores the hashes in the CertificateRegistry smart contract
on the configured blockchain (Sepolia or local).
"""
import sys
import io
import hashlib
import json
import os
from pathlib import Path
from datetime import datetime

# Force UTF-8 on stdout so emoji/special chars do not crash on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from fpdf import FPDF
from web3 import Web3
from dotenv import load_dotenv

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 13)
        self.cell(0, 10, "KScouts - Certificate Authority", border=False, ln=True, align="C")
        self.set_draw_color(30, 120, 255)
        self.set_line_width(0.8)
        self.line(10, 20, 200, 20)
        self.ln(6)

def generate_and_register(w3, contract, account, player_info):
    filename = f"demo_certificate_{player_info['file_suffix']}.pdf"
    output_pdf = Path(f"../frontend/public/{filename}")
    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    
    # ── 1. Generate PDF ──────────────────────────────────────────────
    pdf = PDF()
    pdf.add_page()

    # Title
    pdf.set_font("Arial", "B", 26)
    pdf.set_text_color(30, 60, 120)
    pdf.cell(0, 18, "CERTIFICATE OF ACHIEVEMENT", ln=True, align="C")

    # Decorative line
    pdf.set_draw_color(200, 160, 30)
    pdf.set_line_width(1.2)
    pdf.line(30, pdf.get_y(), 180, pdf.get_y())
    pdf.ln(10)

    # Body
    pdf.set_font("Arial", "", 14)
    pdf.set_text_color(40, 40, 40)
    
    body_text = (
        "This certifies that\n\n"
        f"{player_info['name'].upper()} ({player_info['email']})\n\n"
        "has been scouted and officially evaluated as part of the\n"
        f"{player_info['event']}.\n\n"
        f"Position: {player_info['position']} | Rating: {player_info['rating']}/100"
    )
    
    pdf.multi_cell(0, 9, body_text, align="C")
    pdf.ln(8)

    # Date
    pdf.set_font("Arial", "I", 11)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, f"Issued: {datetime.now().strftime('%d %B %Y')}", ln=True, align="C")

    # Footer line
    pdf.set_draw_color(30, 120, 255)
    pdf.set_line_width(0.5)
    pdf.line(10, 270, 200, 270)
    pdf.set_y(272)
    pdf.set_font("Arial", "I", 9)
    pdf.cell(0, 6, "KScouts Blockchain-Verified Certificate. Do not alter this document.", align="C")

    pdf.output(str(output_pdf))
    print(f"\n─────────────────────────────────────────────────────")
    print(f"[OK] Certificate generated: {filename}")

    # ── 2. Compute SHA-256 ───────────────────────────────────────────
    with open(output_pdf, "rb") as f:
        cert_bytes = f.read()

    cert_hash_hex = hashlib.sha256(cert_bytes).hexdigest()
    print(f"[HASH] SHA-256: {cert_hash_hex}")

    # ── 3. Store hash on blockchain ──────────────────────────
    if not w3 or not contract:
        print("[WARN] Blockchain not connected. Hash NOT stored on-chain.")
        return

    try:
        hash_bytes32 = bytes.fromhex(cert_hash_hex).ljust(32, b"\x00")[:32]

        # Check if already registered
        already = contract.functions.verifyCertificate(hash_bytes32).call()
        if already:
            print("[INFO] Hash already registered on-chain — skipping transaction.")
            return

        # Build & send transaction
        tx = contract.functions.storeCertificateHash(hash_bytes32).build_transaction({
            "from":     account.address,
            "nonce":    w3.eth.get_transaction_count(account.address),
            "gas":      200_000,
            "maxFeePerGas": max(w3.eth.gas_price * 2, w3.to_wei("3", "gwei")),
            "maxPriorityFeePerGas": w3.to_wei("2", "gwei")
        })
        signed  = w3.eth.account.sign_transaction(tx, private_key=account.key)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        print(f"[SUCCESS] Hash stored on-chain!")
        print(f"  Tx hash : {tx_hash.hex()}")
        print(f"  Block   : {receipt['blockNumber']}")
    except Exception as e:
        print(f"[ERROR] Blockchain error for {player_info['name']}: {e}")

if __name__ == "__main__":
    # --- DEMO PLAYERS CONFIGURATION ---
    # Edit this list to generate unique certificates or add more!
    players = [
        {
            "name": "Alex Test",
            "email": "alex.test@kscouts.io",
            "event": "KScouts U18 Regional Trials - Spring 2025",
            "position": "Central Midfielder",
            "rating": "87",
            "file_suffix": "alex_cm"
        },
        {
            "name": "Jordan Smith",
            "email": "jordan.smith@example.com",
            "event": "London Elite Youth Showcase",
            "position": "Striker",
            "rating": "91",
            "file_suffix": "jordan_st"
        },
        {
            "name": "Marcus Rashford",
            "email": "marcus@demo.local",
            "event": "Manchester United Academy Invitations",
            "position": "Left Winger",
            "rating": "94",
            "file_suffix": "marcus_lw"
        }
    ]

    # --- BLOCKCHAIN SETUP ---
    env_path = Path(__file__).parent / ".env"
    load_dotenv(dotenv_path=env_path)
    RPC_URL = os.getenv("BLOCKCHAIN_RPC_URL", "https://eth-sepolia.g.alchemy.com/v2/7_ELPk4SmX3nUiwxWg4R2")
    PRIVATE_KEY = os.getenv("WALLET_PRIVATE_KEY", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    contract = None
    account = None

    if w3.is_connected():
        print(f"✅ Connected to blockchain at {RPC_URL}")
        abi_path = Path(__file__).parent.parent / "blockchain" / "abi" / "CertificateRegistry.json"
        try:
            with open(abi_path) as f:
                abi_data = json.load(f)
            CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", abi_data.get("address", ""))
            contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=abi_data["abi"])
            account = w3.eth.account.from_key(PRIVATE_KEY)
            print(f"✅ Contract: {CONTRACT_ADDRESS}")
            print(f"✅ Sender: {account.address}")
        except Exception as e:
            print(f"⚠️ Could not load contract/account: {e}")
            w3 = None
    else:
        print(f"⚠️ Cannot connect to blockchain at {RPC_URL}. Generating PDFs only.")

    # --- GENERATE LOOP ---
    for player in players:
        generate_and_register(w3, contract, account, player)
    
    print("\n🎉 All demo certificates generated and anchored!")
