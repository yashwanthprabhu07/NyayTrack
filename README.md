# NyayTrack - AI-Powered Court Order Compliance Engine

> AI for Bharat Hackathon 2026 | Theme 11: From Court Judgments to Verified Action Plans

## Problem
India delivers 73 lakh court orders every year. Once a judgment is uploaded as a PDF, there is zero automated system to track whether orders are actually executed. Citizens win in court but lose in reality.

## Solution
NyayTrack ingests court judgment PDFs and automatically converts them into structured, trackable, deadline-bound Action Cards — assigned to the right authority, with real-time compliance status.

## Demo
- Upload any court judgment PDF
- AI extracts all directives, authorities, and deadlines
- Dashboard shows RAG status (Overdue/Due Soon/Compliant)
- Citizens can search by case number

## Tech Stack
- **AI:** NVIDIA NIM (meta/llama-3.1-8b-instruct)
- **OCR:** Tesseract + pdfplumber
- **Backend:** Python FastAPI + PostgreSQL
- **Frontend:** React.js + Tailwind CSS

## Setup

### Backend
`ash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
`

### Frontend
`ash
cd frontend
npm install
npm start
`

## Features
- PDF ingestion (digital + scanned)
- AI-powered directive extraction
- Real-time compliance dashboard
- RAG status tracking
- Citizen case search
- Status management

## Team
- Yashwanth Prabhu R
