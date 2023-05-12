import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { useForm } from 'react-hook-form';
import { TaskInterface } from './FrappeGantt';

interface TaskFormProps {
    task: TaskInterface;
    onSubmit: (updated_task: TaskInterface) => void;
}

interface TaskFormData {
    start: string;
    end: string;
}

const DATE_FORMAT = 'yyyy-MM-dd HH:mm';

export const TaskForm = (props: TaskFormProps): JSX.Element => {
    const { task, onSubmit } = props;

    const { register, handleSubmit } = useForm<TaskFormData>({
        defaultValues: {
            start: format(fromUnixTime(task.startUnixTime), DATE_FORMAT),
            end: format(fromUnixTime(task.endUnixTime), DATE_FORMAT),
        },
    });

    const onValid = (data: TaskFormData) => {
        const updatedTask: TaskInterface = {
            id: task.id,
            name: task.name,
            startUnixTime: getUnixTime(new Date(data.start)),
            endUnixTime: getUnixTime(new Date(data.end)),
        };
        onSubmit(updatedTask);
    };

    return (
        <form onSubmit={handleSubmit(onValid)}>
            <label>start</label>
            <input {...register('start', { required: true })} />

            <label>end</label>
            <input {...register('end', { required: true })} />

            <input type="submit" />
        </form>
    );
};
