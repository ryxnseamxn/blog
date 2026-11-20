import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';

interface Props extends TextInputProps {
  label?: string;
}

export function TextField({ label, style, ...inputProps }: Props) {
  const { colors, fonts } = useAppTheme();

  return (
    <View style={styles.field}>
      {label ? <AppText style={styles.label}>{label}</AppText> : null}
      <TextInput
        placeholderTextColor={colors.mutedText}
        {...inputProps}
        style={[
          styles.input,
          fonts.regular,
          { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexGrow: 1,
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});
