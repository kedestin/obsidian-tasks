/**
 * @jest-environment jsdom
 */
import moment from 'moment';
import { Query } from '../../src/Query/Query';
import { resetSettings, updateSettings } from '../../src/Config/Settings';
import { explainResults } from '../../src/lib/QueryRenderer';

window.moment = moment;

describe('explain', () => {
    afterEach(() => {
        resetSettings();
    });

    it('should explain a task', () => {
        const source = '';
        const query = new Query({ source });

        const expectedDisplayText = `Explanation of this Tasks code block query:

No filters supplied. All tasks will match the query.`;

        expect(explainResults(query)).toEqual(expectedDisplayText);
    });

    it('should explain a task with global filter active', () => {
        updateSettings({ globalFilter: '#task' });

        const source = '';
        const query = new Query({ source });

        const expectedDisplayText = `Only tasks containing the global filter '#task'.

Explanation of this Tasks code block query:

No filters supplied. All tasks will match the query.`;
        expect(explainResults(query)).toEqual(expectedDisplayText);
    });

    it('should explain a task with global query active', () => {
        updateSettings({ globalQuery: 'description includes hello' });

        const source = '';
        const query = new Query({ source });

        const expectedDisplayText = `Explanation of the global query:

description includes hello

Explanation of this Tasks code block query:

No filters supplied. All tasks will match the query.`;

        expect(explainResults(query)).toEqual(expectedDisplayText);
    });

    it('should explain a task with global query and global filter active', () => {
        updateSettings({ globalQuery: 'description includes hello', globalFilter: '#task' });

        const source = '';
        const query = new Query({ source });

        const expectedDisplayText = `Only tasks containing the global filter '#task'.

Explanation of the global query:

description includes hello

Explanation of this Tasks code block query:

No filters supplied. All tasks will match the query.`;

        expect(explainResults(query)).toEqual(expectedDisplayText);
    });
});
