import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { theme } from '@/theme/colors';

const FADE_IN_DURATION = 500;
const HOLD_DURATION = 500;
const FADE_OUT_DURATION = 500;

type SplashWordmarkProps = {
  playing: boolean;
  fontLoaded: boolean;
  onFinish: () => void;
};

export function SplashWordmark({
  playing,
  fontLoaded,
  onFinish,
}: Readonly<SplashWordmarkProps>) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!playing) return;

    opacity.value = withSequence(
      withTiming(1, { duration: FADE_IN_DURATION }),
      withDelay(
        HOLD_DURATION,
        withTiming(0, { duration: FADE_OUT_DURATION }, (finished) => {
          if (finished) {
            scheduleOnRN(onFinish);
          }
        }),
      ),
    );

    return () => cancelAnimation(opacity);
  }, [playing, onFinish, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      pointerEvents="none"
    >
      <Animated.Text
        style={[
          styles.text,
          fontLoaded && { fontFamily: 'Montserrat' },
        ]}
      >
        ryxnseamxn
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 2,
  },
});