import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useAppTheme } from '@/hooks/use-app-theme';
import { fromDateTimeInputs, toDateTimeInputs } from '../format';
import type { GatheringInput } from '../types';

interface Props {
  initial?: GatheringInput;
  submitLabel: string;
  /** Resolves true when saved. */
  onSubmit: (input: GatheringInput) => Promise<boolean>;
}

const DEFAULT_START_HOUR = 17;

function initialFields(initial?: GatheringInput) {
  const startsAt = initial?.date ?? new Date(new Date().setHours(DEFAULT_START_HOUR, 0, 0, 0)).toISOString();
  return {
    name: initial?.name ?? '',
    hostName: initial?.hostName ?? '',
    location: initial?.location ?? '',
    ...toDateTimeInputs(startsAt),
  };
}

export function GatheringForm({ initial, submitLabel, onSubmit }: Props) {
  const { colors } = useAppTheme();
  const [fields, setFields] = useState(() => initialFields(initial));
  const [invalidDate, setInvalidDate] = useState(false);
  const [busy, setBusy] = useState(false);
  const field = (key: keyof typeof fields) => ({
    value: fields[key],
    onChangeText: (value: string) => setFields((current) => ({ ...current, [key]: value })),
  });

  const submit = async () => {
    const date = fromDateTimeInputs(fields.date, fields.time);
    setInvalidDate(!date);
    if (!date) return;

    setBusy(true);
    const { name, hostName, location } = fields;
    const saved = await onSubmit({ name: name.trim(), hostName: hostName.trim(), date, location: location.trim() || null });
    setBusy(false);
    if (saved && !initial) setFields(initialFields());
  };

  return (
    <View style={styles.form}>
      <TextField label="Name" placeholder="Friendsgiving 2026" {...field('name')} />
      <TextField label="Host" placeholder="Your name" {...field('hostName')} />
      <View style={styles.row}>
        <TextField label="Date" placeholder="YYYY-MM-DD" {...field('date')} />
        <TextField label="Time" placeholder="HH:MM" {...field('time')} />
      </View>
      {invalidDate ? (
        <AppText style={{ color: colors.danger }}>Use YYYY-MM-DD for the date and 24-hour HH:MM for the time.</AppText>
      ) : null}
      <TextField label="Location (optional)" placeholder="123 Main St" {...field('location')} />
      <Button
        label={submitLabel}
        onPress={submit}
        busy={busy}
        disabled={!fields.name.trim() || !fields.hostName.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
