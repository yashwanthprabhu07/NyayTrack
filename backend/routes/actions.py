from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import ActionCard
from schemas import ActionCardResponse
from datetime import datetime, date
from typing import List, Optional

router = APIRouter()

def get_rag_status(card: ActionCard) -> str:
    if card.status == "compliant":
        return "green"
    if not card.deadline_date:
        return "grey"
    try:
        deadline = datetime.strptime(card.deadline_date, "%Y-%m-%d").date()
        today = date.today()
        days_left = (deadline - today).days
        if days_left < 0:
            return "red"
        elif days_left <= 7:
            return "amber"
        else:
            return "green"
    except:
        return "grey"

@router.get("/actions", response_model=List[ActionCardResponse])
def get_all_actions(
    status: Optional[str] = None,
    directive_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ActionCard)
    if status:
        query = query.filter(ActionCard.status == status)
    if directive_type:
        query = query.filter(ActionCard.directive_type == directive_type)
    cards = query.order_by(ActionCard.created_at.desc()).all()
    result = []
    for card in cards:
        card_dict = {
            "id": card.id,
            "case_number": card.case_number,
            "court_name": card.court_name,
            "judgment_date": card.judgment_date,
            "petitioner": card.petitioner,
            "respondent": card.respondent,
            "directive_text": card.directive_text,
            "responsible_authority": card.responsible_authority,
            "deadline_date": card.deadline_date,
            "deadline_days": card.deadline_days,
            "directive_type": card.directive_type,
            "penalty_if_missed": card.penalty_if_missed,
            "proof_required": card.proof_required,
            "confidence_score": card.confidence_score,
            "status": card.status,
            "source_filename": card.source_filename,
            "created_at": card.created_at,
            "rag_status": get_rag_status(card)
        }
        result.append(card_dict)
    return result

@router.get("/actions/{action_id}")
def get_action(action_id: int, db: Session = Depends(get_db)):
    card = db.query(ActionCard).filter(ActionCard.id == action_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Action card not found")
    return {
        "id": card.id,
        "case_number": card.case_number,
        "court_name": card.court_name,
        "judgment_date": card.judgment_date,
        "petitioner": card.petitioner,
        "respondent": card.respondent,
        "directive_text": card.directive_text,
        "responsible_authority": card.responsible_authority,
        "deadline_date": card.deadline_date,
        "directive_type": card.directive_type,
        "penalty_if_missed": card.penalty_if_missed,
        "proof_required": card.proof_required,
        "confidence_score": card.confidence_score,
        "status": card.status,
        "source_filename": card.source_filename,
        "created_at": card.created_at,
        "rag_status": get_rag_status(card)
    }

@router.patch("/actions/{action_id}/status")
def update_status(action_id: int, status: str, db: Session = Depends(get_db)):
    card = db.query(ActionCard).filter(ActionCard.id == action_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Action card not found")
    allowed = ["pending", "in_progress", "compliant", "overdue"]
    if status not in allowed:
        raise HTTPException(status_code=400, detail=f"Status must be one of {allowed}")
    card.status = status
    db.commit()
    return {"message": f"Status updated to {status}", "id": action_id}

@router.get("/actions/search/{case_number}")
def search_by_case(case_number: str, db: Session = Depends(get_db)):
    cards = db.query(ActionCard).filter(
        ActionCard.case_number.ilike(f"%{case_number}%")
    ).all()
    if not cards:
        raise HTTPException(status_code=404, detail="No actions found for this case number")
    return cards
