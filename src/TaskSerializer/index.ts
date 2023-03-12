import type { Task } from '../Task';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * A subset of fields of {@link Task} that can be parsed from the textual
 * description of that Task.
 *
 * All fields are writeable for convenience.
 *
 * Some previously non-nullable fields are marked nullable so that they
 *    can optionally share a common code path for parsing.
 *    example: {@link TaskDetails.tags} can be left nullable by {@link TaskSerializer.deserialize})
 *             so that {@link Task.fromLine} parses tags from the description.
 */
export type TaskDetails = Writeable<
    Pick<
        Task,
        | 'description'
        | 'priority'
        | 'startDate'
        | 'createdDate'
        | 'scheduledDate'
        | 'dueDate'
        | 'doneDate'
        | 'recurrence'
    > &
        Partial<Pick<Task, 'tags'>>
>;

/**
 * An abstraction that manages how a {@link Task} is read from and written
 * to a file.
 *
 * A {@link TaskSerializer} is only responsible for the single line of text that follows
 * after the checkbox:
 *
 *        - [ ] This is a task description
 *              ~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * @exports
 * @interface TaskSerializer
 */
export interface TaskSerializer {
    /**
     * Parses task details from the string representation of a task
     *
     * @param line The single line of text to parse
     * @returns The parsed {@link TaskDetails}, or null the string could not be parsed
     */
    deserialize(line: string): TaskDetails | null;

    /**
     * Creates the string representation of a {@link Task}
     *
     * @param task The {@link Task} to stringify
     * @returns {string}
     */
    serialize(task: Task): string;
}

export { DefaultTaskSerializer } from './DefaultTaskSerializer';
