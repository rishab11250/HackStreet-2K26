import { beforeEach, describe, expect, it } from 'vitest';
import useStore from './useStore';

describe('useStore activity log', () => {
  beforeEach(() => {
    useStore.setState({
      elements: [],
      selectedIds: [],
      activityLog: [],
    });
  });

  it('records activity when adding an element', () => {
    useStore.getState().addElement({
      id: 'e1',
      type: 'rect',
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });
    const { activityLog } = useStore.getState();
    expect(activityLog.length).toBe(1);
    expect(activityLog[0].action).toMatch(/created/);
    expect(activityLog[0].kind).toBe('create');
  });

  it('toggleLockSelected appends lock activity', () => {
    useStore.setState({
      elements: [{ id: 'a', type: 'rect', x: 0, y: 0, width: 1, height: 1, locked: false }],
      selectedIds: ['a'],
      activityLog: [],
    });
    useStore.getState().toggleLockSelected();
    expect(useStore.getState().activityLog[0].kind).toBe('lock');
    expect(useStore.getState().elements[0].locked).toBe(true);
  });
});
