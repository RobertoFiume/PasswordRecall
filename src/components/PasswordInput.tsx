import { Colors, Icon, Layout, ThemeContext } from '@infominds/react-native-components';
import React, { useContext, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
 
type Props = {
  placeholder: string
};
 
export type PasswordInputProps = Props & TextInput['props'];
 
export default function PasswordInput(props: PasswordInputProps) {
  const colorScheme = useContext(ThemeContext);
  const theme = Colors[colorScheme];
  const { style, ...otherProps } = props;
 
  const [icon, setIcon] = useState<string>('eye');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggleIconPress = () => {
    if (icon === 'eye') {
      if (Platform.OS === 'web')
        setIcon('eye-off')
      else
        setIcon('eye-slash')
      setShowPassword(true)
    }
    else {
      setIcon('eye')
      setShowPassword(false)
    }
  }
 
  return (
    <View style={[styles.searchSection, Layout.defaultComponentsStyles,
    {
      backgroundColor: theme.inputBackground,
      borderColor: theme.inputBorder
    }, style]}>
      <TextInput
        style={[styles.input, { color: theme.text }, style]}
        underlineColorAndroid="transparent"
        placeholderTextColor={theme.textPlaceholder}
        textContentType="password"
        secureTextEntry={!showPassword}
        {...otherProps}
      />
      <Icon
        style={{ paddingRight: 2 }}
        family={Platform.OS === 'web' ? 'Feather' : 'FontAwesome5'}
        name={icon}
        size={20}
        color={theme.textDetail}
        onPress={toggleIconPress}
      />
    </View>
  )
}
 
const styles = StyleSheet.create({
  input: {
    flex: 1,
    padding: 12
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingRight: 5
  }
 
});