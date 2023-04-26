import type { Task } from '../Task';
import type { Grouper } from './Grouper';
import { GroupDisplayHeadingSelector } from './GroupDisplayHeadingSelector';
import { TaskGroupingTree } from './TaskGroupingTree';
import { TaskGroup } from './TaskGroup';

/**
 * Store all the groups of tasks generated by any 'group by'
 * instructions in the task block.
 *
 * The groups are stored in array of {@link TaskGroup} objects.
 * @see {@link Grouper}
 * @see {@link Query.grouping}
 */
export class TaskGroups {
    private _groups: TaskGroup[] = new Array<TaskGroup>();
    private _totalTaskCount = 0;

    /**
     * Constructor for {@link TaskGroups}
     * @param {Grouper[]} groups - 0 or more {@link Grouper} objects,
     *                              1 per 'group by' line in the task query block
     * @param {Task[]} tasks - all the tasks matching the query, already sorted
     */
    constructor(groups: Grouper[], tasks: Task[]) {
        // Grouping doesn't change the number of tasks, and all the tasks
        // will be shown in at least one group.
        this._totalTaskCount = tasks.length;

        const taskGroupingTree = new TaskGroupingTree(groups, tasks);
        this.addTasks(taskGroupingTree);
    }

    /**
     * All the tasks matching the query, grouped together, and in the order
     * that they should be displayed.
     *
     * If the tasks are ungrouped, a single {@link TaskGroup} will be returned,
     * with no heading names.
     */
    public get groups(): TaskGroup[] {
        return this._groups;
    }

    /**
     * The total number of unique tasks matching the query.
     *
     * Note that tasks may be displayed more than once. For example any tasks with more than one
     * tag will be displayed multiple times if grouped by Tag.
     * So summing the number of tasks in all the {@link groups} can give a larger number than
     * this.
     */
    public totalTasksCount() {
        return this._totalTaskCount;
    }

    /**
     * A human-readable representation of all the task groups.
     *
     * Note that this is used in snapshot testing, so if the format is
     * changed, the snapshots will need to be updated.
     */
    public toString(): string {
        let output = '';
        for (const taskGroup of this.groups) {
            output += taskGroup.toString();
            output += '\n---\n';
        }
        const totalTasksCount = this.totalTasksCount();
        output += `\n${totalTasksCount} tasks\n`;
        return output;
    }

    private addTasks(taskGroupingTree: TaskGroupingTree) {
        // Get the headings
        const displayHeadingSelector = new GroupDisplayHeadingSelector(taskGroupingTree.groups);

        // Build a container of all the groups
        for (const [groups, tasks] of taskGroupingTree.groups) {
            const groupHeadings = displayHeadingSelector.getHeadingsForTaskGroup(groups);
            const taskGroup = new TaskGroup(groups, groupHeadings, tasks);
            this.add(taskGroup);
        }
    }

    private add(taskGroup: TaskGroup) {
        this._groups.push(taskGroup);
    }
}
