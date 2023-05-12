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

    const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);

    useEffect(Streamlit.setFrameHeight);

    const ClickedTaskForm = (): JSX.Element | null => {
        const onSubmit = (updatedTask: TaskInterface): void => {
            setClickedTask(null);
            Streamlit.setComponentValue(updatedTask);
            console.log('onSubmit');
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
                tasks={args['tasks']}
                onClickTask={setClickedTask}
                onUpdateTask={Streamlit.setComponentValue}
            />
            <ClickedTaskForm />
        </>
    );
};

export default withStreamlitConnection(GanttComponent);
