import { useEffect, useState } from 'react';
import {
    ComponentProps,
    Streamlit,
    withStreamlitConnection,
} from 'streamlit-component-lib';
import { FrappeGantt, TaskInterface } from './FrappeGantt';
import { TaskForm } from './TaskForm';

const GanttComponent = (props: ComponentProps): JSX.Element => {
    const { args } = props;

    const [tasks, setTasks] = useState<TaskInterface[]>(args['tasks']);
    const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);

    useEffect(Streamlit.setFrameHeight);

    const onUpdateTask = (updatedTask: TaskInterface): void => {
        // 元のtasksを直接変更してしまわないため、新たなリストを生成して設定
        const copiedTasks = tasks.map((task) => ({ ...task }));
        const taskIndex = tasks.findIndex((task) => task.id === updatedTask.id);
        copiedTasks[taskIndex] = { ...updatedTask };
        setTasks(copiedTasks);

        Streamlit.setComponentValue(updatedTask);
    };

    const ClickedTaskForm = (): JSX.Element | null => {
        const onSubmit = (updatedTask: TaskInterface): void => {
            setClickedTask(null);
            onUpdateTask(updatedTask);
        };

        if (clickedTask) {
            return <TaskForm task={clickedTask} onSubmit={onSubmit} />;
        } else {
            return null;
        }
    };

    return (
        <>
            <FrappeGantt
                tasks={tasks}
                onClickTask={setClickedTask}
                onUpdateTask={onUpdateTask}
            />
            <ClickedTaskForm />
        </>
    );
};

export default withStreamlitConnection(GanttComponent);
