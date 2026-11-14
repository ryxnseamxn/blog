import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SplashAnimation } from "@/animations/Splash/Splash";

type SplashScreenProps = {
  onReady: () => void;
  onFinish: () => void;
};

export default function SplashScreenView({
  onReady,
  onFinish,
}: Readonly<SplashScreenProps>) {
  const [playing, setPlaying] = useState(false);

  const handleLayout = useCallback(() => {
    if (playing) return;

    // RootLayout hides the native splash.
    onReady();

    // Start the custom animation.
    setPlaying(true);
  }, [playing, onReady]);

  return (
    <View
      style={styles.container}
      onLayout={handleLayout}
      accessibilityViewIsModal
    >
      <SplashAnimation playing={playing} onFinish={onFinish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
});
