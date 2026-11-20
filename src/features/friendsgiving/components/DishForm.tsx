import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { CATEGORY_DETAILS } from '../categories';
import type { DishCategory, NewDish } from '../types';

interface Props {
  category: DishCategory;
  submitLabel: string;
  /** Resolves true when the dish was saved, which clears the form. */
  onSubmit: (dish: NewDish) => Promise<boolean>;
}

export function DishForm({ category, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [busy, setBusy] = useState(false);
  const defaultEmoji = CATEGORY_DETAILS[category].emoji;

  const submit = async () => {
    if (!name.trim()) return;
    setBusy(true);
    const saved = await onSubmit({ name: name.trim(), emoji: emoji.trim() || defaultEmoji, category });
    setBusy(false);
    if (saved) {
      setName('');
      setEmoji('');
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.row}>
        <TextField placeholder="Dish name" value={name} onChangeText={setName} onSubmitEditing={submit} />
        <TextField placeholder={defaultEmoji} value={emoji} onChangeText={setEmoji} style={styles.emoji} />
      </View>
      <Button label={submitLabel} onPress={submit} busy={busy} disabled={!name.trim()} />
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
  emoji: {
    width: 64,
    textAlign: 'center',
  },
});
