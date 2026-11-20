import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';

interface Props {
  adminKey: string;
  onSave: (adminKey: string) => void;
}

/** Shown while the admin list can't load, which usually means a missing or wrong key. */
export function AdminKeyCard({ adminKey, onSave }: Props) {
  const [draft, setDraft] = useState(adminKey);

  return (
    <Card title="Admin key">
      <View style={styles.row}>
        <TextField
          placeholder="Matches Admin:ApiKey on the server"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => onSave(draft.trim())}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button label="Save" onPress={() => onSave(draft.trim())} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
