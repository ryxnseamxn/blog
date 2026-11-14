import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconWave } from './IconWave';
import { SplashWordmark } from './SplashWordmark';

type SplashAnimationProps = {
  playing: boolean;
  fontLoaded: boolean;
  onFinish: () => void;
};

export function SplashAnimation({
  playing,
  fontLoaded,
  onFinish,
}: Readonly<SplashAnimationProps>) {
  const [waveFinished, setWaveFinished] = useState(false);

  const handleWaveFinish = useCallback(() => {
    setWaveFinished(true);
  }, []);

  return (
    <View style={styles.container}>
      <IconWave
        playing={playing}
        onFinish={handleWaveFinish}
      />

      <SplashWordmark
        playing={playing && waveFinished}
        fontLoaded={fontLoaded}
        onFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});