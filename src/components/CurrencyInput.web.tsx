import { Layout, ThemeContext } from '@infominds/react-native-components';
import React, { useContext } from 'react';
import { StyleSheet, TextInput as DefaultTextInput } from 'react-native';
import { Colors } from '../constants/Colors';

type Props = {
    symbol: string | undefined;
};

export type TextInputProps = Props & DefaultTextInput['props'];

export default function CurrencyInput(props: TextInputProps) {
    const colorScheme = useContext(ThemeContext);
    const theme = Colors[colorScheme];
    const { style, value, ...otherProps } = props;

    // const [isSymbolVisible, setIsSymbolVisible] = useState(true)
    return (
        <DefaultTextInput
            style={[
                styles.input,
                Layout.defaultComponentsStyles,
                {
                    color: theme.text,
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.inputBorder
                },
                style]}
            keyboardType={'decimal-pad'}
            placeholderTextColor={theme.textPlaceholder}
            // onTouchStart={() => { setIsSymbolVisible(false) }}
            // onEndEditing={() => { setIsSymbolVisible(true) }}
            value={value}
            {...otherProps}
        >
        </DefaultTextInput>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12
    }
});