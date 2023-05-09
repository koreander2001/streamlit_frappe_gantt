from datetime import datetime
from typing import Iterable

import pandas as pd
import streamlit as st

from streamlit_frappe_gantt.gantt import GanttComponentEvent, GanttTask, gantt_component


def find_task_index_by_id(tasks: Iterable[GanttTask], id: int) -> int:
    for i, task in enumerate(tasks):
        if task.id == id:
            return i
    else:
        return -1


def main() -> None:
    st.set_page_config(page_title="Frappe Gantt Example", layout="wide")

    tasks = [
        GanttTask(
            id=1,
            name="タスク1",
            start=datetime.fromisoformat("2023-04-01 00:00"),
            end=datetime.fromisoformat("2023-04-01 06:00"),
        ),
        GanttTask(
            id=2,
            name="タスク2",
            start=datetime.fromisoformat("2023-04-01 06:00"),
            end=datetime.fromisoformat("2023-04-01 12:00"),
        ),
        GanttTask(
            id=3,
            name="タスク3",
            start=datetime.fromisoformat("2023-04-01 12:00"),
            end=datetime.fromisoformat("2023-04-01 18:00"),
        ),
        GanttTask(
            id=4,
            name="タスク4",
            start=datetime.fromisoformat("2023-04-01 18:12"),
            end=datetime.fromisoformat("2023-04-02 00:34"),
        ),
    ]

    gantt_component_result = gantt_component(tasks)
    if gantt_component_result:
        event = gantt_component_result.event
        if event == GanttComponentEvent.UPDATE:
            updated_task = gantt_component_result.task

            task_index = find_task_index_by_id(tasks, updated_task.id)
            assert task_index >= 0
            tasks[task_index] = updated_task

    task_df = pd.DataFrame(tasks).set_index("id")
    st.dataframe(task_df)


if __name__ == "__main__":
    main()
