const computer = require("@/assets/images/computer.png");
const rook = require("@/assets/images/rook.png");
const drums = require("@/assets/images/drums.png");
const note = require("@/assets/images/note.png");
const saturn = require("@/assets/images/saturn.png");

import { StyleSheet, View } from "react-native";
import { WaveIcon } from "./Icon";

const images = [
    { id: 'computer', src: computer, name: 'computer' },
    { id: 'rook', src: rook, name: 'rook' },
    { id: 'drums', src: drums, name: 'drums' },
    { id: 'note', src: note, name: 'note' },
    { id: 'saturn', src: saturn, name: 'saturn' }
];

type SplashAnimationProps = {
  playing: boolean;
  onFinish: () => void;
};

export function SplashAnimation({
  playing,
  onFinish,
}: Readonly<SplashAnimationProps>) {
  return (
    <View style={styles.container}>
      {images.map((img, index) => (
        <WaveIcon
          key={img.id}
          source={img.src}
          delay={index * 120}
          playing={playing}
          onFinish={
            index === images.length - 1 ? onFinish : undefined
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
