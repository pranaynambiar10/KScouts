import hashlib
from fpdf import FPDF

# Create third demo certificate for Sid
pdf_path = '../frontend/public/demo_certificate_sid.pdf'

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(80)
        self.cell(30, 10, 'KScouts Verification Demo', 0, 0, 'C')
        self.ln(20)

pdf = PDF()
pdf.add_page()
pdf.set_font('Arial', 'B', 24)
pdf.cell(0, 20, 'CERTIFICATE OF ACHIEVEMENT', 0, 1, 'C')
pdf.set_font('Arial', '', 14)
pdf.cell(0, 10, 'This certifies that SID (sid@gmail.com) has participated in the U21 Trial.', 0, 1, 'C')
pdf.output(pdf_path)

# Hash it
with open(pdf_path, 'rb') as f:
    file_bytes = f.read()
    cert_hash = hashlib.sha256(file_bytes).hexdigest()

print('HASH_SID:', cert_hash)
