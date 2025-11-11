import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function TimeSelector({
    hour, setHour, minute, setMinute, ampm, setAmPm
}: {
    hour: string, setHour: (e: any) => void, minute: string, setMinute: (e: any) => void, ampm: string, setAmPm: (e: any) => void
}) {

  // Hours array (01-12)
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  // Minutes array (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // AM/PM array
  const ampmOptions = ['AM', 'PM'];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        
        {/* Hour Picker */}
        <Picker
        placeholder='Hour'
          selectedValue={hour}
          style={styles.picker}
          onValueChange={(itemValue) => setHour(itemValue)}
          itemStyle={{ color: '#000', fontSize: 22 }}
        >
          {hours.map((h) => (
            <Picker.Item key={h} label={h} value={h} />
          ))}
        </Picker>

        {/* Minute Picker */}
        <Picker
          selectedValue={minute}
          style={styles.picker}
          onValueChange={(itemValue) => setMinute(itemValue)}
          itemStyle={{ color: '#000', fontSize: 22 }}
        >
          {minutes.map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>

        {/* AM/PM Picker */}
        <Picker
          selectedValue={ampm}
          style={styles.picker}
          onValueChange={(itemValue) => setAmPm(itemValue)}
          itemStyle={{ color: '#000', fontSize: 22 }}
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
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
    height: 55,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});
