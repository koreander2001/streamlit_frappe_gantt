from pathlib import Path
from typing import Dict, Iterable, Optional

from streamlit.components.v1.components import declare_component

from .task import Task


def gantt_component(tasks: Iterable[Task], key: Optional[str] = None) -> Optional[Task]:
    component_func = declare_component(
        "gantt_component",
        path=str(Path(__file__).parent / "frontend" / "build"),
    )

    component_result: Dict = component_func(
        key=key,
        tasks=list(map(Task.to_json, tasks)),
    )

    return Task.from_json(component_result) if component_result else None
