import { Text, type TextProps } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';

export function AppText({ style, ...props }: TextProps) {
  const { colors, fonts } = useAppTheme();

  return (
    <Text
      {...props}
      style={[
        fonts.regular,
        {
          color: colors.text,
          fontSize: 16,
        },
        style,
      ]}
    />
  );
}