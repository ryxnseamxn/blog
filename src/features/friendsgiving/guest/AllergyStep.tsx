import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';

interface Props {
  guestName: string;
  onSubmit: (details: string | null) => void;
}

export function AllergyStep({ guestName, onSubmit }: Props) {
  const [details, setDetails] = useState('');
  const submit = () => details.trim() && onSubmit(details.trim());

  return (
    <Card title={`🥜 Any allergies, ${guestName}?`}>
      <AppText>Let everyone know what to keep off your plate so they can cook with it in mind.</AppText>
      <TextField
        placeholder="e.g. peanuts, shellfish, gluten"
        value={details}
        onChangeText={setDetails}
        onSubmitEditing={submit}
        maxLength={100}
        autoFocus
      />
      <View style={styles.actions}>
        <Button label="Share allergies →" onPress={submit} disabled={!details.trim()} />
        <Button label="No allergies" variant="secondary" onPress={() => onSubmit(null)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
  },
});
