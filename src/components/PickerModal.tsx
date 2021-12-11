import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext, View, Text, Colors, List, LanguageContext, Layout, Icon, CardBasic } from '@infominds/react-native-components'
import ContentPopupModal from "./ContentPopupModal";

export default function PickerModal(props: {
    data: any,
    renderSelected: (item: any) => string
    renderItemContent: ({ item, index }: any) => JSX.Element,
    onDelete?: () => void,
    onSelect?: (item: any) => void,
    placeholder?: string,
    editable?: boolean
    value?: any,
    style?: any
}) {
    const lang = React.useContext(LanguageContext);
    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    const [selected, setSelected] = useState();

    const [isModalBottomVisible, setModalBottomVisible] = useState(false);
    const toggleModalBottom = () => setModalBottomVisible(!isModalBottomVisible);

    useEffect(() => {
        // if (!selected) {
        setSelected(props.value)
        // }
    }, [props.value, selected]);

    return (
        <View>
            <TouchableOpacity onPress={() => { if (props.editable !== false) toggleModalBottom() }}
                style={[
                    styles.input,
                    props.style,
                    Layout.defaultComponentsStyles]}>
                {selected ?
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ margin: 5, marginRight: 10 }}>{props.renderSelected(selected)}</Text>
                            <Icon family='FontAwesome5' name='sort-down' size={20} color={Colors.icon} style={{ padding: 0, margin: 5, marginTop: 0 }} />
                        </View>
                    </View>
                    :
                    <Text style={{ color: theme.textPlaceholder, margin: 0 }}>{props.placeholder ?? lang.SELECT_PLACEHOLDER}</Text>
                }
            </TouchableOpacity>

            <ContentPopupModal
                isVisible={isModalBottomVisible}
                close={toggleModalBottom}
                style={{}}
                content={() =>
                    <List
                        data={props.data}
                        style={{ margin: 8 }}
                        renderItem={({ item, index }: any) => (
                            <TouchableOpacity onPress={() => { setSelected(item); toggleModalBottom(); props.onSelect?.(item) }}>
                                <CardBasic>
                                    {props.renderItemContent({ item, index })}
                                </CardBasic>
                            </TouchableOpacity>
                        )}
                    />
                }
            />
        </View >
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        padding: 0,
        alignContent: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});
