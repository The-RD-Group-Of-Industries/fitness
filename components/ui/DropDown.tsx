import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const CustomDropdown = ({data}: {
    data: {label: string, value: string}[]
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Select an Trainer");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (item: { label: string; value: string }) => {
    setSelectedValue(item.label);
    setIsOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>{selectedValue}</Text>
      </TouchableOpacity>
      {isOpen && (
        <ScrollView
          style={styles.dropdownList}
          nestedScrollEnabled={true}
        >
          {data.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.dropdownItem}
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
  dropdownContainer: {
    marginVertical: 10,
  },
  dropdown: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#3082fc",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  dropdownText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  dropdownList: {
    maxHeight: 200,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#3082fc",
    borderRadius: 10,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 14,
  },
  itemText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomDropdown;
