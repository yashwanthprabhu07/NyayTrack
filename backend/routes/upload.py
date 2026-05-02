from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import pdfplumber
import pytesseract
from pdf2image import convert_from_bytes
import cv2
import numpy as np
import io
from services.ai_extractor import extract_directives
from database import get_db
from models import ActionCard

router = APIRouter()

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
POPPLER_PATH = r'C:\Users\YASHWANTH PRABHU R\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin'

def extract_digital_pdf(file_bytes) -> str:
    text = ""
    with pdfplumber.open(file_bytes) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

def preprocess_image(image):
    img_array = np.array(image)
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return binary

def extract_scanned_pdf(file_bytes: bytes) -> str:
    text = ""
    images = convert_from_bytes(file_bytes, poppler_path=POPPLER_PATH)
    for image in images:
        processed = preprocess_image(image)
        page_text = pytesseract.image_to_string(processed, lang='eng')
        text += page_text + "\n"
    return text.strip()

def is_digital_pdf(file_bytes: bytes) -> bool:
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                if page.extract_text():
                    return True
    except:
        pass
    return False

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    file_bytes = await file.read()
    if len(file_bytes) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 20MB")
    try:
        # Step 1: Extract text
        if is_digital_pdf(file_bytes):
            pdf_type = "digital"
            extracted_text = extract_digital_pdf(io.BytesIO(file_bytes))
        else:
            pdf_type = "scanned"
            extracted_text = extract_scanned_pdf(file_bytes)

        if not extracted_text or len(extracted_text) < 50:
            raise HTTPException(status_code=422, detail="Could not extract text from PDF")

        # Step 2: AI extraction
        directives = extract_directives(extracted_text)

        # Step 3: Save to database
        saved_cards = []
        for directive in directives:
            card = ActionCard(
                case_number=directive.get("case_number"),
                court_name=directive.get("court_name"),
                judgment_date=directive.get("judgment_date"),
                petitioner=directive.get("petitioner"),
                respondent=directive.get("respondent"),
                directive_text=directive.get("directive_text"),
                responsible_authority=directive.get("responsible_authority"),
                deadline_date=directive.get("deadline_date"),
                deadline_days=directive.get("deadline_days"),
                directive_type=directive.get("directive_type"),
                penalty_if_missed=directive.get("penalty_if_missed"),
                proof_required=directive.get("proof_required"),
                confidence_score=directive.get("confidence_score", 0.0),
                status="pending",
                source_filename=file.filename
            )
            db.add(card)
            saved_cards.append(directive)

        db.commit()

        return JSONResponse(content={
            "status": "success",
            "filename": file.filename,
            "pdf_type": pdf_type,
            "text_length": len(extracted_text),
            "directives_found": len(directives),
            "directives_saved": len(saved_cards),
            "directives": saved_cards
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/upload")
def upload_info():
    return {"message": "Upload endpoint ready. Use POST /api/upload to upload a PDF"}
