from datetime import datetime
from typing import List

import pandas as pd
import streamlit as st

from streamlit_frappe_gantt.gantt import gantt_component
from streamlit_frappe_gantt.task import Task


def init_session_state() -> None:
    if "tasks" not in st.session_state:
        st.session_state["tasks"] = [
            Task(
                id=1,
                name="タスク1",
                start=datetime.fromisoformat("2023-04-01 00:00"),
                end=datetime.fromisoformat("2023-04-01 06:00"),
            ),
            Task(
                id=2,
                name="タスク2",
                start=datetime.fromisoformat("2023-04-01 06:00"),
                end=datetime.fromisoformat("2023-04-01 12:00"),
            ),
            Task(
                id=3,
                name="タスク3",
                start=datetime.fromisoformat("2023-04-01 12:00"),
                end=datetime.fromisoformat("2023-04-01 18:00"),
            ),
            Task(
                id=4,
                name="タスク4",
                start=datetime.fromisoformat("2023-04-01 18:12"),
                end=datetime.fromisoformat("2023-04-02 00:34"),
            ),
        ]


def find_task_index_by_id(tasks: List[Task], id: int) -> int:
    for i, task in enumerate(tasks):
        if task.id == id:
            return i
    else:
        return -1


def update_task(updated_task: Task) -> None:
    tasks: List[Task] = st.session_state["tasks"]

    task_index = None
    for i, _task in enumerate(tasks):
        if _task.id == updated_task.id:
            task_index = i

    if task_index is None:
        raise ValueError(f"Not found task: {updated_task}")

    tasks[task_index] = updated_task


def main() -> None:
    st.set_page_config(page_title="Frappe Gantt Example", layout="wide")

    init_session_state()

    updated_task = gantt_component(st.session_state["tasks"])
    if updated_task:
        update_task(updated_task)

    task_df = pd.DataFrame(st.session_state["tasks"]).set_index("id")
    st.dataframe(task_df)


if __name__ == "__main__":
    main()
