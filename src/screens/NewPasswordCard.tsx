import * as React from 'react';
import {
    Screen, Text, Colors, Icon, LanguageContext, ThemeContext, Title,
    Input, Button, Note, Layout, ImValidators, LoadingIndicator, ButtonType
} from '@infominds/react-native-components';
import { TouchableOpacity, ScrollView, View, StyleSheet, Platform, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';
import Label from '../components/Label';
import { useCallback, useState } from 'react';
import LoadingSpinnerModal from '../components/LoadingSpinnerModal'
import PasswordInput from '../components/PasswordInput'
import Card from '../utils/sysdata';

String.prototype.replaceAll = function (search: any, replacement: any) {
    return this.split(search).join(replacement);
};

export default function NewPasswordCardScreen(props: { navigation: any, route: any }) {
    const lang = React.useContext(LanguageContext);
    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    const [showErrors, setShowErrors] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
   
    const [id, setID] = useState<string>();
    const [categoryid, setCategoryid] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [username, setUserName] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [note, setNote] = useState<string>();
    const [pincode, setPinCode] = useState<string>();
    const [url,setUrl] = useState<string>();

    const detail = props.route?.params?.detail as Card;
    const readOnly = props.route?.params?.readOnly as boolean | false;

    function setPasswordCardoModify() {
        if (!detail) 
            return;

        console.debug('detail', detail);

        setID(detail.id);
        setCategoryid(detail.categoryid);
        setDescription(detail.description);
        setUserName(detail.username);
        setPassword (detail.password);
        setNote(detail.note);
        setPinCode(detail.pincode);
        setUrl(detail.url);
    }

    React.useEffect(() => {
        setPasswordCardoModify();  
    }, []);  


    React.useEffect(() => {
       
    }, []);

    useFocusEffect(useCallback(() => {

    }, []));

    async function onSave(isUpate: boolean = false) {
        console.debug("save");

        if (!request) {
            setShowErrors(true);
            return false;
        } else {
            console.debug(isUpate ? 'PUT' : 'POST', request);

            let result: any;
           /*
            if (!isUpate) {
                result = await useApi.postExpense(request);
            } else
                result = await useApi.putExpense(request);
*/
            if (hasUplpadImagePermission)
                await UploadImages(result.id);

            if (hasUplpadImagePermission && isUpate) {
                
            }
            return result;
        }
    }

  
    console.info('open view');
    return (
        
        <Screen backgroundImage='ellipse8' style={{ padding: 0 }} scrollable={false}  >
            {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : undefined}> */}
            <ScrollView style={{ padding: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!detail && Platform.OS !== 'web') {
                                    Alert.alert(lang.CHANGES_WILL_BE_LOST, '', [
                                        {
                                            text: lang.BACK_YES, onPress: () => {
                                                props.navigation.navigate('Root');
                                            }
                                        },
                                        { text: lang.BACK_NO, onPress: () => null }
                                    ]);
                                } else {
                                    props.navigation.navigate('Root');
                                }
                            }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                                padding: 5,

                            }}>
                                <Icon
                                    name={'arrow-left'}
                                    size={28}
                                    color={theme.text}></Icon>
                            </View>
                        </TouchableOpacity>
                        <Title style={{ color: theme.text }}>{detail?.description || lang.NEW_REQUEST}</Title>
                    </View>
                </View>

                <Label text = {'Descrizione'} />
                <Input
                    editable = {!readOnly}
                    value = {description}
                    onChangeText={(value: string) => {
                      setDescription(value);
                    }}
                />

                <Label text = {'Url'} />
                <Input
                    editable = {!readOnly}
                    value = {url}
                    onChangeText={(value: string) => {
                      setUrl(value);
                    }}
                />

                <Label text = {'Nome utente'} />
                <Input
                    editable = {!readOnly}
                    value = {username}
                    onChangeText={(value: string) => {
                      setNote(value);
                    }}
                />

                <Label text = {'password'} />
                <PasswordInput
                    editable = {!readOnly}
                    autoCorrect = {false} 
                    value = {password}
                 
                    onChangeText={(value: string) => {
                      setPassword(value);
                    } } 
                    placeholder={''}                
                />

                <Label text = {"Note"} />
                <Note 
                    placeholder={''}
                    value = {note}
                    editable = {!readOnly}
                    onChangeText={(value: string) => {
                      setNote(note);
                    } } 
                />
            </ScrollView >

            <LoadingSpinnerModal visible={disableButton} />
            {/* </KeyboardAvoidingView> */}

            <LoadingSpinnerModal visible={disableButton} />
            {/* </KeyboardAvoidingView> */}
        </Screen >

    )

    
}

  