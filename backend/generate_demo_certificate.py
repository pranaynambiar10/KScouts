"""
generate_test_cert.py
Generates a new test certificate PDF, prints its SHA-256 hash,
and stores the hash in the CertificateRegistry smart contract
on the local Hardhat node.
"""
import sys
# Force UTF-8 on stdout so emoji/special chars do not crash on Windows
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

import hashlib
import json
from pathlib import Path
from datetime import datetime

# ── 1. Generate PDF ──────────────────────────────────────────────
from fpdf import FPDF

output_pdf = Path("../frontend/public/demo_certificate_test.pdf")
output_pdf.parent.mkdir(parents=True, exist_ok=True)

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 13)
        self.cell(0, 10, "KScouts - Certificate Authority", border=False, ln=True, align="C")
        self.set_draw_color(30, 120, 255)
        self.set_line_width(0.8)
        self.line(10, 20, 200, 20)
        self.ln(6)

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
pdf.multi_cell(0, 9,
    "This certifies that\n\n"
    "ALEX TEST (alex.test@kscouts.io)\n\n"
    "has been scouted and officially evaluated as part of the\n"
    "KScouts U18 Regional Trials - Spring 2025 Season.\n\n"
    "Position: Central Midfielder | Rating: 87/100",
    align="C"
)
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
print(f"[OK] Certificate generated: {output_pdf.resolve()}")

# ── 2. Compute SHA-256 ───────────────────────────────────────────
with open(output_pdf, "rb") as f:
    cert_bytes = f.read()

cert_hash_hex = hashlib.sha256(cert_bytes).hexdigest()
print(f"\n[HASH] SHA-256: {cert_hash_hex}")
print(f"       0x form:  0x{cert_hash_hex}")

# ── 3. Store hash on Hardhat blockchain ──────────────────────────
try:
    from web3 import Web3
    from dotenv import load_dotenv
    import os

    load_dotenv()

    RPC_URL     = os.getenv("BLOCKCHAIN_RPC_URL", "http://127.0.0.1:8545")
    PRIVATE_KEY = os.getenv("WALLET_PRIVATE_KEY",
                            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")

    abi_path = Path(__file__).parent.parent / "blockchain" / "abi" / "CertificateRegistry.json"
    with open(abi_path) as f:
        abi_data = json.load(f)

    CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", abi_data.get("address", ""))

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print(f"\n[WARN] Cannot connect to blockchain at {RPC_URL}")
        print("       Make sure 'npx hardhat node' is running in the blockchain/ folder.")
        sys.exit(1)

    print(f"\n[CHAIN] Connected to {RPC_URL}")
    print(f"        Contract: {CONTRACT_ADDRESS}")

    contract = w3.eth.contract(
        address=Web3.to_checksum_address(CONTRACT_ADDRESS),
        abi=abi_data["abi"]
    )

    account = w3.eth.account.from_key(PRIVATE_KEY)
    hash_bytes32 = bytes.fromhex(cert_hash_hex).ljust(32, b"\x00")[:32]

    # Check if already registered
    already = contract.functions.verifyCertificate(hash_bytes32).call()
    if already:
        print("\n[INFO] Hash already registered on-chain — no action needed.")
        sys.exit(0)

    # Build & send transaction
    tx = contract.functions.storeCertificateHash(hash_bytes32).build_transaction({
        "from":     account.address,
        "nonce":    w3.eth.get_transaction_count(account.address),
        "gas":      200_000,
        "gasPrice": w3.to_wei("1", "gwei"),
    })
    signed  = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    print(f"\n[SUCCESS] Hash stored on-chain!")
    print(f"  Tx hash : {tx_hash.hex()}")
    print(f"  Block   : {receipt['blockNumber']}")
    print(f"  Gas used: {receipt['gasUsed']}")
    print(f"\n[COPY THIS to verify on the KScouts site]")
    print(f"  {cert_hash_hex}")

except ImportError:
    print("\n[WARN] web3/dotenv not available. Hash NOT stored on-chain.")
    print(f"  Manual hash: {cert_hash_hex}")
except Exception as e:
    print(f"\n[ERROR] Blockchain error: {e}")
    print(f"  Hash generated but NOT stored on-chain.")
    print(f"  Hash: {cert_hash_hex}")
