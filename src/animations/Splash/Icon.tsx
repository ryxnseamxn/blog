import { useEffect } from 'react';
import { StyleSheet, type ImageSourcePropType } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type WaveIconProps = {
  source: ImageSourcePropType;
  delay: number;
  playing: boolean;
  onFinish?: () => void;
};

export function WaveIcon({
  source,
  delay,
  playing,
  onFinish,
}: Readonly<WaveIconProps>) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!playing) return;

    translateY.value = 0;
    translateY.value = withDelay(
      delay,
      withSequence(
        withTiming(-12, { duration: 300 }),
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished && onFinish) {
            scheduleOnRN(onFinish);
          }
        }),
      ),
    );

    return () => cancelAnimation(translateY);
  }, [playing, delay, onFinish, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Image
      source={source}
      style={[styles.image, animatedStyle]}
      resizeMode="contain"
      accessible={false}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
  },
});