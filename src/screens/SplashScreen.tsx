import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SplashAnimation } from '@/animations/Splash/Splash';

type SplashScreenProps = {
  canStart: boolean;
  fontLoaded: boolean;
  onReady: () => void;
  onFinish: () => void;
};

export default function SplashScreenView({
  canStart,
  fontLoaded,
  onReady,
  onFinish,
}: Readonly<SplashScreenProps>) {
  const [hasLayout, setHasLayout] = useState(false);
  const [playing, setPlaying] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasLayout || !canStart || hasStarted.current) return;

    hasStarted.current = true;

    // Hide the native splash, then begin the custom sequence.
    onReady();
    setPlaying(true);
  }, [hasLayout, canStart, onReady]);

  return (
    <View
      style={styles.container}
      onLayout={() => setHasLayout(true)}
      accessibilityViewIsModal
    >
      <SplashAnimation
        playing={playing}
        fontLoaded={fontLoaded}
        onFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
});