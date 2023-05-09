from datetime import datetime

import pandas as pd
import streamlit as st

from streamlit_frappe_gantt.gantt import GanttTask, gantt_component


def main() -> None:
    st.set_page_config(page_title="Frappe Gantt Example", layout="wide")

    default_tasks = (
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
    )
    tasks = gantt_component(default_tasks)

    task_df = pd.DataFrame(tasks).set_index("id")
    st.dataframe(task_df)


if __name__ == "__main__":
    main()
