import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet, RNHostView } from '@expo/ui';

import { useAppTheme } from '@/hooks/use-app-theme';

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function EmojiPicker({ isVisible, children, onClose }: Props) {
  const { colors } = useAppTheme();

  return (
    <BottomSheet
      isPresented={isVisible}
      onDismiss={onClose}
      snapPoints={['half']}
      containerColor={colors.card}>
      <RNHostView>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Choose a sticker</Text>
          {children}
        </View>
      </RNHostView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginBottom: 20,
  },
});
