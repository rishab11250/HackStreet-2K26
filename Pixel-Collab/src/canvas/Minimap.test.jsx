import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import Minimap from './Minimap';
import useStore from '../store/useStore';

function MinimapHarness({ presentationMode = false }) {
  const ref = useRef(null);
  return (
    <div ref={ref} data-testid="canvas-host" style={{ width: 640, height: 480 }}>
      <Minimap containerRef={ref} presentationMode={presentationMode} />
    </div>
  );
}

describe('Minimap', () => {
  beforeEach(() => {
    useStore.setState({
      elements: [
        { id: '1', type: 'rect', x: 0, y: 0, width: 100, height: 50, zIndex: 1 },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    });
  });

  it('renders accessible minimap canvas', () => {
    render(<MinimapHarness />);
    expect(screen.getByRole('img', { name: /minimap/i })).toBeInTheDocument();
  });

  it('returns null in presentation mode', () => {
    render(<MinimapHarness presentationMode />);
    expect(screen.queryByRole('img', { name: /minimap/i })).not.toBeInTheDocument();
  });
});
