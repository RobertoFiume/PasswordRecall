import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import {
    View, Icon, Text, Colors, LanguageContext, SearchList, SearchBox,
    Card, CardBasic, Input, ThemeContext
} from '@infominds/react-native-components'
import Touch from './Touchable'
import ContentModal from "./ContentModal";


export default function SearchInputModal(props: {
    text: string,
    data: any,
    renderSelected: (item: any) => string,
    searchString: (item: any) => string,
    renderItemContent: ({ item, index }: any) => JSX.Element,
    onSelect?: (item: any) => void,
    onDelete?: () => void,
    initSelected?: any,
    value?: any,
    editable?: boolean,
    style?: any,
    footer?: JSX.Element
}) {
    const [selected, setSelected] = useState(props.initSelected);

    const [isModalBottomVisible, setModalBottomVisible] = useState(false);
    const toggleModalBottom = () => setModalBottomVisible(!isModalBottomVisible);

    useEffect(() => {
        setSelected(props.value)
    }, [props.value, selected]);

    return (
        <View>
            <Touch style={{}}
                onPress={() => { if (props.editable !== false) toggleModalBottom() }}>
                <View style={{ flex: 1, flexDirection: 'row', marginRight: 10 }}>
                    {selected ?
                        <Input
                            style={[{ paddingTop: 10, paddingBottom: 10, width: '100%' }, props.style]}
                            editable={false}
                            placeholder={props.text}
                            value={props.renderSelected(selected)}>
                        </Input>
                        :
                        <SearchBox
                            style={[{ justifyContent: 'flex-end', width: '100%' }, props.style]}
                            placeholder={props.text}
                            editable={false}>
                        </SearchBox>

                    }
                </View>
            </Touch>

            <ContentModal
                isVisible={isModalBottomVisible}
                close={toggleModalBottom}
                style={{ height: '90%' }}
                content={() =>
                    <View style={{ flex: 1, justifyContent: 'space-between' }} >
                        <View style={{ height: '100%' }}>
                            <SearchList
                                searchBarOverlay={false}
                                style={{ padding: 10 }}
                                data={props.data}
                                searchLabel={props.text}
                                searchString={props.searchString}
                                footer={props.footer}
                                renderItem={({ item, index }: any) => (
                                    <TouchableOpacity onPress={() => { setSelected(item); toggleModalBottom(); props.onSelect?.(item) }}>
                                        <CardBasic>
                                            {props.renderItemContent({ item, index })}
                                        </CardBasic>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                } />
        </View >
    );
}


const styles = StyleSheet.create({
    icon: {
        backgroundColor: Colors.grey,
        marginRight: 10,
        borderRadius: 8,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
        marginLeft: 5
    }
});