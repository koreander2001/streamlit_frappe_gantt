from dataclasses import dataclass
from datetime import datetime
from typing import Dict


@dataclass(frozen=True)
class Task:
    id: int
    name: str
    start: datetime
    end: datetime

    @classmethod
    def from_json(cls, d: Dict) -> "Task":
        return Task(
            id=d["id"],
            name=d["name"],
            start=datetime.fromtimestamp(d["startUnixTime"]),
            end=datetime.fromtimestamp(d["endUnixTime"]),
        )

    def to_json(self) -> Dict:
        return {
            "id": self.id,
            "name": self.name,
            "startUnixTime": self.start.timestamp(),
            "endUnixTime": self.end.timestamp(),
        }
