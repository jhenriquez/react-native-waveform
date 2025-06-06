import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';

export interface AmplitudeSource {
  subscribe: (cb: (amplitude: number) => void) => () => void;
}

export interface WaveformProps {
  amplitudeSource: AmplitudeSource;
  barCount?: number;
  barWidth?: number;
  barSpacing?: number;
  barColor?: string;
  backgroundColor?: string;
  maxHeight?: number;
  baseline?: number;
}

interface BarProps {
  height: number;
  width: number;
  spacing: number;
  color: string;
}

const Bar: React.FC<BarProps> = React.memo(
  ({ height, width, spacing, color }) => (
    <View
      testID="waveform-bar"
      style={{
        width,
        height,
        marginRight: spacing,
        backgroundColor: color,
        alignSelf: 'center',
        borderRadius: 2,
      }}
    />

  ),
  (prev, next) =>
    prev.height === next.height &&
    prev.width === next.width &&
    prev.spacing === next.spacing &&
    prev.color === next.color
);

export const Waveform: React.FC<WaveformProps> = ({
                                                    amplitudeSource,
                                                    barCount = 30,
                                                    barWidth = 6,
                                                    barSpacing = 3,
                                                    barColor = '#000',
                                                    backgroundColor = 'transparent',
                                                    maxHeight = 25,
                                                    baseline = 0.15,
                                                  }) => {
  const initial = useMemo(() => Array(barCount).fill(baseline), [barCount, baseline]);

  const [amplitudes, setAmplitudes] = useState<ReadonlyArray<number>>(initial);
  const bufferRef = useRef<number[]>(initial);

  const containerWidth = useMemo(
    () => barCount * barWidth + (barCount - 1) * barSpacing,
    [barCount, barWidth, barSpacing]
  );

  useEffect(() => {
    return amplitudeSource.subscribe((amplitude: number) => {
      const clamped = Math.max(amplitude, baseline);
      bufferRef.current = [...bufferRef.current.slice(1), clamped];
      setAmplitudes([...bufferRef.current]);
    });
  }, [amplitudeSource, barCount, baseline]);

  return (
    <View
      style={[
        styles.container,
        {
          height: maxHeight * 2,
          width: containerWidth,
          backgroundColor,
        },
      ]}
    >
      {amplitudes.map((a, i) => (
        <Bar
          key={i}
          height={a * 2 * maxHeight}
          width={barWidth}
          spacing={i === barCount - 1 ? 0 : barSpacing}
          color={barColor}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
