import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import useStore from './store/useStore';

describe('App integration', () => {
  beforeEach(() => {
    useStore.setState({ presentationMode: false });
  });

  it('renders main workspace chrome', async () => {
    render(<App />);
    expect(await screen.findByText('CollabBoard')).toBeInTheDocument();
  });

  it('Alt+P enters presentation and hides top bar', async () => {
    render(<App />);
    await screen.findByText('CollabBoard');
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'p', altKey: true, bubbles: true })
    );
    await waitFor(() => {
      expect(screen.queryByText('CollabBoard')).not.toBeInTheDocument();
    });
    expect(useStore.getState().presentationMode).toBe(true);
  });

  it('Escape exits presentation mode', async () => {
    useStore.setState({ presentationMode: true });
    render(<App />);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitFor(() => {
      expect(useStore.getState().presentationMode).toBe(false);
    });
  });
});
