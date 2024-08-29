import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioButtonsProps {
    options: Array<string>;
    selectedOption: String;
    onSelect: () => void;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({ options, selectedOption, onSelect }) => {
  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.radioButtonContainer}
          onPress={onSelect}
        >
          <View style={styles.radioButton}>
            {selectedOption === option && <View style={styles.radioButtonSelected} />}
          </View>
          <Text style={styles.radioButtonText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  radioButtonText: {
    fontSize: 16,
  },
});

export default RadioButtons;
