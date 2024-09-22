// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Image } from 'react-native';

interface ButtonsProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: string;
}

const iconMap: { [key: string]: any } = {
  matchesIcon: require('../assets/images/matchesIcon.png'),
  heartIcon: require('../assets/images/heartIcon.png'),
};

const Buttons: React.FC<ButtonsProps> = ({ title, onPress, buttonStyle, textStyle , disabled, icon = undefined}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && iconMap[icon] && <Image source={iconMap[icon]} style={styles.icon} />}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  }
});

export default Buttons;
