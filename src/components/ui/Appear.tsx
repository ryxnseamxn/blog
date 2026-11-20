import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

const STAGGER_MS = 60;

interface Props {
  /** Position in a list; staggers the entrance so items cascade in. */
  index?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/** Springs content in from below, fades it out, and glides it when siblings move. */
export function Appear({ index = 0, style, children }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * STAGGER_MS).springify()}
      exiting={FadeOut.duration(150)}
      layout={LinearTransition.springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
