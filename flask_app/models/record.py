from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import mapped_column, Mapped, relationship
from datetime import datetime
from .base import Base


class Record(Base):
    """
    Modelo que representa la tabla Record en la base de datos.
    """
    __tablename__ = 'record'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    person_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('person.id'), nullable=False)
    concept: Mapped[str] = mapped_column(String(80), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(String(200))
    date: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False)

    person = relationship("Person")

    def __repr__(self):
        return f"<Record {self.concept}, amount {self.amount}, description {self.description}, date {self.date}>"
