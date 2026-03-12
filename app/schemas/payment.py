from decimal import Decimal

from app.models.payment import PaymentMethod, PaymentStatus
from app.schemas.common import TimestampedSchema


class PaymentRead(TimestampedSchema):
    id: int
    amount: Decimal
    currency: str
    method: PaymentMethod
    status: PaymentStatus
    transaction_reference: str
