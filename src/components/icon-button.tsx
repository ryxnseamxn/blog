import { Pressable, StyleSheet, Text, type ImageSourcePropType } from 'react-native';
import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';

import { useAppTheme } from '@/hooks/use-app-theme';

type Props = {
  icon: {
    android: ImageSourcePropType;
    ios: SFSymbol;
    web: AndroidSymbol;
  };
  label: string;
  onPress: () => void;
};

export default function IconButton({
  icon,
  label,
  onPress,
}: Readonly<Props>) {
  const { colors } = useAppTheme();

  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <SymbolView name={{ web: icon.web }} size={24} tintColor={colors.text} />
      <Text style={[styles.iconButtonLabel, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonLabel: {
    marginTop: 12,
  },
});