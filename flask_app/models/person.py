from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import mapped_column, Mapped
from datetime import datetime
from .base import Base


class Person(Base):
    """
    Modelo que representa la tabla Person en la base de datos.
    """
    __tablename__ = 'person'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    firstName: Mapped[str] = mapped_column(String(80), nullable=False)
    lastName: Mapped[str] = mapped_column(String(80), nullable=False)
    isconcertado: Mapped[bool] = mapped_column(Boolean, nullable=False)
    isactive: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False)
    date_joined: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False)
    date_left: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Person {self.firstName} {self.lastName}, isconcertado {self.isconcertado}, isactive {self.isactive}, date_joined {self.date_joined}, date_left {self.date_left}>"
