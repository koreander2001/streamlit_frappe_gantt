import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { useEffect, useRef } from 'react';
import Gantt from './frappe/gantt';

export interface TaskInterface {
    id: number;
    name: string;
    startUnixTime: number;
    endUnixTime: number;
}

interface FrappeGanttTask {
    id: string;
    name: string;
    start: string | Date;
    end: string | Date;
    progress: number;
}

interface FrappeGanttInitializedTask extends FrappeGanttTask {
    _start: Date;
    _end: Date;
}

interface FrappeGanttProps {
    tasks: TaskInterface[];
    onClickTask: (clickedTask: TaskInterface) => void;
    onUpdateTask: (updatedTask: TaskInterface) => void;
}

const convertToFrappeGanttTask = (task: TaskInterface): FrappeGanttTask => {
    return {
        id: task.id.toString(),
        name: task.name,
        start: fromUnixTime(task.startUnixTime),
        end: fromUnixTime(task.endUnixTime),
        progress: 100,
    };
};

const convertToTaskInterface = (
    task: FrappeGanttInitializedTask
): TaskInterface => {
    return {
        id: Number(task.id),
        name: task.name,
        startUnixTime: getUnixTime(task._start),
        endUnixTime: getUnixTime(task._end),
    };
};

export const FrappeGantt = (props: FrappeGanttProps): JSX.Element => {
    const { tasks, onClickTask, onUpdateTask } = props;

    const ganttTag = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        const ganttTasks = tasks.map(convertToFrappeGanttTask);
        new Gantt(ganttTag.current, ganttTasks, {
            view_mode: 'Hour',
            language: 'en',
            on_click: (task: FrappeGanttInitializedTask) => {
                onClickTask(convertToTaskInterface(task));
            },
            on_date_change: (task: FrappeGanttInitializedTask) => {
                onUpdateTask(convertToTaskInterface(task));
            },
            custom_popup_html: (task: FrappeGanttInitializedTask) => {
                const DATE_FORMAT = 'yyyy-MM-dd HH:mm';
                return `
					<div class="title">${task.name}</div>
    		        <div class="subtitle">
						<div style="white-space: nowrap;">${format(task._start, DATE_FORMAT)}</div>
						<div style="text-align: center;">~</div>
						<div style="white-space: nowrap;">${format(task._end, DATE_FORMAT)}</div>
					</div>
				`;
            },
        });
    });

    return <div ref={ganttTag}></div>;
};
