import React from 'react';
import { render } from '@testing-library/react-native';
import { Waveform, AmplitudeSource } from '../src/Waveform';

function createFakeSource(values: number[], delayMs = 0): AmplitudeSource {
  return {
    subscribe: (cb) => {
      let cancelled = false;
      values.forEach((v, i) => {
        setTimeout(() => {
          if (!cancelled) cb(v);
        }, i * delayMs);
      });
      return () => {
        cancelled = true;
      };
    },
  };
}

describe('Waveform', () => {
  it('renders the correct number of bars', () => {
    const source = createFakeSource([0.2, 0.5, 0.7, 0.4]);
    const barCount = 5;
    const { getAllByTestId } = render(
      <Waveform amplitudeSource={source} barCount={barCount} />
    );

    const bars = getAllByTestId('waveform-bar');
    expect(bars.length).toBe(barCount);
  });

  it('applies custom bar color', () => {
    const source = createFakeSource([0.5]);
    const barColor = 'tomato';
    const { getAllByTestId } = render(
      <Waveform amplitudeSource={source} barColor={barColor} barCount={3} />
    );
    const bars = getAllByTestId('waveform-bar');
    bars.forEach((bar) => {
      expect(bar.props.style.backgroundColor).toBe(barColor);
    });
  });

  it('clamps amplitude values below baseline', () => {
    const source = createFakeSource([0.01, 0.02]);
    const { getAllByTestId } = render(
      <Waveform amplitudeSource={source} barCount={2} baseline={0.15} />
    );
    const bars = getAllByTestId('waveform-bar');
    bars.forEach((bar) => {
      expect(bar.props.style.height).toBeGreaterThanOrEqual(0.3 * 25); // baseline * 2 * maxHeight
    });
  });
});
