import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActivityFeed from './ActivityFeed';
import useStore from '../../store/useStore';

describe('ActivityFeed', () => {
  beforeEach(() => {
    useStore.setState({
      activityLog: [
        {
          id: 'a1',
          userId: 'u1',
          userName: 'Alex',
          userColor: '#f00',
          action: 'created rect on the board',
          timestamp: Date.now(),
          kind: 'create',
        },
      ],
    });
  });

  it('renders activity text and user', () => {
    render(<ActivityFeed />);
    expect(screen.getByText(/Alex/)).toBeInTheDocument();
    expect(screen.getByText(/created rect/)).toBeInTheDocument();
  });

  it('shows empty state when no activity', () => {
    useStore.setState({ activityLog: [] });
    render(<ActivityFeed />);
    expect(screen.getByText(/No activity yet/)).toBeInTheDocument();
  });
});
