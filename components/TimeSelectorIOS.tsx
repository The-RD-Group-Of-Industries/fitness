import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Props {
  hour: string;
  setHour: (e: any) => void;
  minute: string;
  setMinute: (e: any) => void;
  ampm: string;
  setAmPm: (e: any) => void;
}

export default function TimeSelector({
  hour, setHour, minute, setMinute, ampm, setAmPm,
}: Props) {
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const ampmOptions = ['AM', 'PM'];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Picker
          selectedValue={hour}
          onValueChange={setHour}
          style={styles.picker}
          itemStyle={{ color: '#222', fontSize: 24 }}
        >
          {hours.map((h) => (
            <Picker.Item key={h} label={h} value={h} />
          ))}
        </Picker>
        <Picker
          selectedValue={minute}
          onValueChange={setMinute}
          style={styles.picker}
          itemStyle={{ color: '#222', fontSize: 24 }}
        >
          {minutes.map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>
        <Picker
          selectedValue={ampm}
          onValueChange={setAmPm}
          style={styles.picker}
          itemStyle={{ color: '#222', fontSize: 24 }}
        >
          {ampmOptions.map((ap) => (
            <Picker.Item key={ap} label={ap} value={ap} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  picker: {
    flex: 1,
    height: 180, // ensures iOS picker roller is visible
  },
});
