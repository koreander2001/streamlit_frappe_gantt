import { useEffect, useState } from "react";
import { ComponentProps, Streamlit, withStreamlitConnection } from "streamlit-component-lib";
import { FrappeGantt, TaskInterface } from "./FrappeGantt";

const GanttComponentEvent = {
  UPDATE: 'UPDATE',
} as const;
type GanttComponentEvent = typeof GanttComponentEvent[keyof typeof GanttComponentEvent];

interface GanttComponentResult {
  task: TaskInterface;
  event: GanttComponentEvent;
}

const GanttComponent = (props: ComponentProps): JSX.Element => {
  const { args } = props;

  const [tasks, setTasks] = useState<TaskInterface[]>(args['tasks']);

  useEffect(Streamlit.setFrameHeight);

  const on_update_task = (updatedTask: TaskInterface): void => {
    // 元のtasksを直接変更してしまわないため、新たなリストを生成して設定
    const copyTasks = tasks.map(task => ({ ...task }));
    const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
    copyTasks[taskIndex] = { ...updatedTask };
    setTasks(copyTasks);

    const result: GanttComponentResult = {
      task: updatedTask,
      event: GanttComponentEvent.UPDATE,
    }
    Streamlit.setComponentValue(result);
  };

  return (
    <>
      <FrappeGantt
        tasks={tasks}
        on_update_task={on_update_task}
      />
    </>
  );
};

export default withStreamlitConnection(GanttComponent);
