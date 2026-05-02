from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class ActionCard(Base):
    __tablename__ = "action_cards"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, index=True)
    court_name = Column(String)
    judgment_date = Column(String)
    petitioner = Column(String)
    respondent = Column(String)
    directive_text = Column(Text)
    responsible_authority = Column(String)
    deadline_date = Column(String, nullable=True)
    deadline_days = Column(Integer, nullable=True)
    directive_type = Column(String)
    penalty_if_missed = Column(Text, nullable=True)
    proof_required = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.0)
    status = Column(String, default="pending")
    source_filename = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
