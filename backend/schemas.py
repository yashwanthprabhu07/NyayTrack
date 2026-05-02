from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActionCardCreate(BaseModel):
    case_number: Optional[str] = None
    court_name: Optional[str] = None
    judgment_date: Optional[str] = None
    petitioner: Optional[str] = None
    respondent: Optional[str] = None
    directive_text: Optional[str] = None
    responsible_authority: Optional[str] = None
    deadline_date: Optional[str] = None
    deadline_days: Optional[int] = None
    directive_type: Optional[str] = None
    penalty_if_missed: Optional[str] = None
    proof_required: Optional[str] = None
    confidence_score: Optional[float] = 0.0
    status: Optional[str] = "pending"
    source_filename: Optional[str] = None

class ActionCardResponse(ActionCardCreate):
    id: int
    created_at: datetime
    rag_status: Optional[str] = None

    class Config:
        from_attributes = True
