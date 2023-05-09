import { useEffect, useState } from "react";
import { ComponentProps, Streamlit, withStreamlitConnection } from "streamlit-component-lib";
import { FrappeGantt, TaskInterface } from "./FrappeGantt";

const GanttComponent = (props: ComponentProps): JSX.Element => {
  const { args } = props;

  const [tasks, setTasks] = useState<TaskInterface[]>(args['tasks']);

  useEffect(Streamlit.setFrameHeight);

  const onUpdateTask = (updatedTask: TaskInterface): void => {
    const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);

    // 元のtasksを直接変更してしまわないため
    const copyTasks = tasks.map(task => ({ ...task }));
    copyTasks[taskIndex].start_unix_time = updatedTask.start_unix_time;
    copyTasks[taskIndex].end_unix_time = updatedTask.end_unix_time;

    setTasks(copyTasks);
    Streamlit.setComponentValue(copyTasks);
  };

  return (
    <>
      <FrappeGantt
        tasks={tasks}
        on_update_task={onUpdateTask}
      />
    </>
  );
};

export default withStreamlitConnection(GanttComponent);
