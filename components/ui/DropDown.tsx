import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownProps {
  data: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({ data, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>("Select a Trainer");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: { label: string; value: string }) => {
    setSelectedItem(item.label);
    setIsOpen(false);
    onSelect(item.value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleDropdown}>
        <Text style={styles.headerText}>{selectedItem || 'Select an item'}</Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} color="white" />
      </TouchableOpacity>
      {isOpen && (
        <ScrollView style={styles.dropdown}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#3082fc",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "700",
  },
  dropdown: {
    maxHeight: 200,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#3082fc",
    borderRadius: 10,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  item: {
    padding: 14,
  },
  itemText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomDropdown;