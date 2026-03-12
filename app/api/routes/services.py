from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.service import Service
from app.schemas.service import ServiceRead

router = APIRouter()


@router.get("", response_model=list[ServiceRead])
def list_services(db: Session = Depends(get_db)):
    return list(db.scalars(select(Service).order_by(Service.id)).all())
