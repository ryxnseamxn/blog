import { useAppTheme } from '@/hooks/use-app-theme';
import { View, Text, Image } from 'react-native';

export default function HeaderCollapsible() {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: colors.background,
      }}
    >
      <Image
        source={require('@/assets/images/sut.png')}

        style={{ width: 100, height: 100, borderRadius: 50 }}
      />

      <Text style={{ color: colors.text, fontSize: 24, marginTop: 10 }}>
        Profile Name
      </Text>
    </View>
  );
}