import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { WaveIcon } from './Icon';

const images = [
  { id: 'computer', src: require('@/assets/images/computer.png') },
  { id: 'rook', src: require('@/assets/images/rook.png') },
  { id: 'drums', src: require('@/assets/images/drums.png') },
  { id: 'note', src: require('@/assets/images/note.png') },
  { id: 'saturn', src: require('@/assets/images/saturn.png') },
];

const ICON_STAGGER = 50;
const FADE_OUT_DURATION = 500;

type IconWaveProps = {
  playing: boolean;
  onFinish: () => void;
};

export function IconWave({
  playing,
  onFinish,
}: Readonly<IconWaveProps>) {
  const opacity = useSharedValue(1);

  const handleWaveFinish = useCallback(() => {
    opacity.value = withTiming(
      0,
      { duration: FADE_OUT_DURATION },
      (finished) => {
        if (finished) {
          scheduleOnRN(onFinish);
        }
      },
    );
  }, [onFinish, opacity]);

  useEffect(() => {
    return () => cancelAnimation(opacity);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.row, animatedStyle]}>
      {images.map((image, index) => (
        <WaveIcon
          key={image.id}
          source={image.src}
          delay={index * ICON_STAGGER}
          playing={playing}
          onFinish={
            index === images.length - 1
              ? handleWaveFinish
              : undefined
          }
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
});