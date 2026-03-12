from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewRead

router = APIRouter()


@router.get("", response_model=list[ReviewRead])
def list_reviews(room_id: int | None = None, db: Session = Depends(get_db)):
    query = select(Review).options(joinedload(Review.user)).order_by(Review.created_at.desc())
    if room_id is not None:
        query = query.where(Review.room_id == room_id)
    return list(db.scalars(query).unique().all())


@router.post("", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
def create_review(
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.scalar(
        select(Review).where(Review.room_id == payload.room_id, Review.user_id == current_user.id)
    )
    if existing:
        raise HTTPException(status_code=400, detail="You already reviewed this room")

    review = Review(
        room_id=payload.room_id,
        user_id=current_user.id,
        rating=payload.rating,
        title=payload.title,
        comment=payload.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return db.scalar(select(Review).options(joinedload(Review.user)).where(Review.id == review.id))
