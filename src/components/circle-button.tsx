import { Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { useAppTheme } from '@/hooks/use-app-theme';

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Readonly<Props>) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      style={[styles.circleButton, { backgroundColor: colors.accent }]}
      onPress={onPress}
    >
      <SymbolView
        name={{ web: 'add' }}
        size={38}
        tintColor={colors.onAccent}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circleButton: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
