import { useEffect, useRef } from "react";
import Gantt from "./frappe/gantt";

export interface TaskInterface {
    id: number;
    name: string;
    start_unix_time: number;
    end_unix_time: number;
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
    on_update_task: (updated_task: TaskInterface) => void;
}

const task_interface_to_frappe_gantt_task = (task: TaskInterface): FrappeGanttTask => {
    return {
        id: task.id.toString(),
        name: task.name,
        start: new Date(task.start_unix_time * 1000),
        end: new Date(task.end_unix_time * 1000),
        progress: 100,
    };
};

const frappe_gantt_task_to_task_interface = (task: FrappeGanttInitializedTask): TaskInterface => {
    return {
        id: Number(task.id),
        name: task.name,
        start_unix_time: task._start.getTime() / 1000,
        end_unix_time: task._end.getTime() / 1000,
    };
};

export const FrappeGantt = (props: FrappeGanttProps): JSX.Element => {
    const { tasks, on_update_task } = props;

    const gantt_tag = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        const gantt_tasks: FrappeGanttTask[] = tasks.map(task_interface_to_frappe_gantt_task);

        new Gantt(gantt_tag.current, gantt_tasks, {
			view_mode: 'Hour',
			language: 'en',
            on_click: (task: FrappeGanttInitializedTask) => {
            },
            on_date_change: (task: FrappeGanttInitializedTask) => {
                on_update_task(frappe_gantt_task_to_task_interface(task));
            },
			custom_popup_html: (task: FrappeGanttInitializedTask) => {
				const date_to_string = (date: Date) => {
					const _date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
					return _date.toISOString().replace('T', ' ').slice(0, 16);
				};

                return `
					<div class="title">${task.name}</div>
    		        <div class="subtitle">
						<div style="white-space: nowrap;">${date_to_string(task._start)}</div>
						<div style="text-align: center;">~</div>
						<div style="white-space: nowrap;">${date_to_string(task._end)}</div>
					</div>
				`;
			},
        });
    });

    return (
        <>
            <div ref={gantt_tag}></div>
        </>
    );
};
