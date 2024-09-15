// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonsProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({ title, onPress, buttonStyle, textStyle , disabled}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});

export default Buttons;
