from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Dict, Iterable, Optional

from streamlit.components.v1.components import declare_component


@dataclass(frozen=True)
class GanttTask:
    id: int
    name: str
    start: datetime
    end: datetime

    @classmethod
    def from_json(cls, d: Dict) -> "GanttTask":
        return GanttTask(
            id=d["id"],
            name=d["name"],
            start=datetime.fromtimestamp(d["start_unix_time"]),
            end=datetime.fromtimestamp(d["end_unix_time"]),
        )

    def to_json(self) -> Dict:
        return {
            "id": self.id,
            "name": self.name,
            "start_unix_time": self.start.timestamp(),
            "end_unix_time": self.end.timestamp(),
        }


class GanttComponentEvent(str, Enum):
    UPDATE = "UPDATE"


@dataclass(frozen=True)
class GanttComponentResult:
    task: GanttTask
    event: GanttComponentEvent


def gantt_component(
    tasks: Iterable[GanttTask],
    key: Optional[str] = None,
) -> Optional[GanttComponentResult]:
    component_func = declare_component(
        "gantt_component",
        path=str(Path(__file__).parent / "frontend" / "build"),
    )

    component_result: Dict = component_func(
        key=key,
        tasks=list(map(GanttTask.to_json, tasks)),
    )

    if component_result:
        return GanttComponentResult(
            task=GanttTask.from_json(component_result["task"]),
            event=GanttComponentEvent(component_result["event"]),
        )
    else:
        return None
