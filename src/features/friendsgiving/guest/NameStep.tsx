import { useState } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';

export function NameStep({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('');
  const submit = () => name.trim() && onSubmit(name.trim());

  return (
    <Card title="👋 Hey there!">
      <AppText>What should we call you? We&apos;ll remember it on this device.</AppText>
      <TextField
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        onSubmitEditing={submit}
        autoComplete="name"
        autoFocus
      />
      <Button label="Let's eat →" onPress={submit} disabled={!name.trim()} />
    </Card>
  );
}
