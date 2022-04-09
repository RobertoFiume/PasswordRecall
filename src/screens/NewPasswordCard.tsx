import * as React from 'react';
import {
    Screen, Text, Colors, Icon, LanguageContext, ThemeContext, Title,
    Input, Button, Note,ButtonType
} from '@infominds/react-native-components';
import 'moment/locale/it'
import 'moment/locale/de'
import { TouchableOpacity, ScrollView, View, StyleSheet, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';
import Label from '../components/Label';
import { useCallback, useState } from 'react';
import LoadingSpinnerModal from '../components/LoadingSpinnerModal';
import SearchInputModal from '../components/SearchInputModal';
import PasswordInput from '../components/PasswordInput';
import SysData, {Card,CategoryType,CATEGORY_DEFAULT,DATABASE_NAME} from '../utils/sysdata';
import createGuid from "react-native-create-guid";
import { TextInput } from 'react-native-gesture-handler';


String.prototype.replaceAll = function (search: any, replacement: any) {
    return this.split(search).join(replacement);
};

export default function NewPasswordCardScreen(props: { navigation: any, route: any }) {
    const lang = React.useContext(LanguageContext);
    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    const [showErrors, setShowErrors] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

    const [categoryid, setCategoryid] = useState<string>();
    const [cardid, setCardid] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [username, setUserName] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [note, setNote] = useState<string>();
    const [pincode, setPinCode] = useState<string>();
    const [url,setUrl] = useState<string>();
    const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>();
    const [categoryType, setCategoryType] = useState<CategoryType>();

    const detail = props.route?.params?.detail as Card;
    const readOnly = props.route?.params?.readOnly as boolean | false;

    function setPasswordCardoModify() {

        if (detail) { 
            setCategoryid(detail.categoryid);
            setCardid(detail.cardid);
            setDescription(detail.description);
            setUserName(detail.username);
            setPassword (detail.password);
            setNote(detail.note);
            setPinCode(detail.pincode);
            setUrl(detail.url);

            setCategoryType(categoryTypes?.find((category: CategoryType) => { return category.categoryid === detail.categoryid }));
        }
        else {
            setCategoryid('');
            setCardid('');
            setDescription('');
            setUserName('');
            setPassword('');
            setNote('');
            setPinCode('');
            setUrl('');
        }
    }

    React.useEffect(() => {
        loadCategories();
        setPasswordCardoModify();

        setCategoryType(categoryTypes?.find((category: CategoryType) => { return category.categoryid === detail.categoryid }));
    }, []);  


    useFocusEffect(useCallback(() => {

    }, []));

    async function loadCategories(): Promise<void> {
        console.debug('Load categories start');
        try
        {
            let db: SysData = new SysData(DATABASE_NAME);
            let result: boolean = await db.openDatabase();
            
            if (result) {
                try {
                    let listOfCategoryTypes: CategoryType[] = await db.getCategoryTypes();  
                    setCategoryTypes(listOfCategoryTypes);

                    if (detail)
                        setCategoryType(listOfCategoryTypes?.find((category: CategoryType) => { return category.categoryid === detail.categoryid }));
                } catch (error) {
                    console.error("Error on get categories",error);
                }
            }
        }
        finally
        {
            console.debug('Load categories end');
        }
    }
  
    async function onSave(isUpdate: boolean = false) {
        let success: boolean = false;

        console.debug("On save start");
        try
        {
            console.info('call save',isUpdate);

            const card = { 
                categoryid: categoryType?.categoryid,
                cardid:  cardid,
                description: description,
                url: url,
                username: username,
                password: password,
                note: note
            } as Card ;

            
            if (!isUpdate) 
            {
                if (card.cardid === null) 
                    card.cardid = await createGuid();
                
                if (card.categoryid === null)
                    card.categoryid = CATEGORY_DEFAULT;
            }

            let db: SysData = new SysData(DATABASE_NAME);
            let result: boolean = await db.openDatabase();

            if (result) {
                try {
                    if (isUpdate) 
                        success = await db.updateCard(card);
                    else
                        success = await db.insertCard(card); 
                } catch (error) {
                    console.error("Error on get categories",error);
                }
            }
        }
        finally
        {
            console.debug("On save end");
        }
        
        return success;
    }

    async function onDelete(cardid: string)
    {
        console.debug("On delete start");
        try
        {
            let db: SysData = new SysData(DATABASE_NAME);
            let result: boolean = await db.openDatabase();

            if (result) 
                await db.deleteCard(cardid);
        }
        finally
        {
            console.debug("On delete end");
        }
    }

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
                                        { 
                                            text: lang.BACK_NO, onPress: () => {
                                             
                                            }
                                        }
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

                <Label text={'Categoria'} />
                <SearchInputModal
                    text = {''}
                    data = {categoryTypes}
                    value = {categoryType}
                    editable = {true}
                    onSelect = {setCategoryType}
                    searchString={item => item.description}
                    renderSelected={(item: CategoryType) => item?.description}
                    renderItemContent={({ item }: { item: CategoryType }) => <Text>{item.description}</Text>}
                />

                <Label text = {lang.DESCRIPTION} />
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

                <Label text = {lang.USERNAME} />
                <Input
                    editable = {!readOnly}
                    value = {username}
                    onChangeText={(value: string) => {
                      setUserName(value);
                    }}
                />

                <Label text = {lang.PASSWORD} />
                <PasswordInput
                    editable = {!readOnly}
                    autoCorrect = {false} 
                    value = {password}
                 
                    onChangeText={(value: string) => {
                      setPassword(value);
                    } } 
                    placeholder={''}                
                />

                <Label text = {lang.NOTE} />
                <Input
                    editable = {!readOnly}
                    placeholder = {''}
                    multiline
                    style = {{minHeight: 100}}
                    value = {note}
                    onChangeText = {(value: string) => {
                      setNote(value);
                    } } 
                />

                {!readOnly &&
                    <Button
                        style = {{ marginBottom: 20 }}
                        title = {lang.SAVE}
                        
                        onPress={() => {
                            setDisableButton(true);
                            const isUpdate = detail !== undefined;
                            onSave(isUpdate)
                                .then((result: boolean) => {
                                    if (result)
                                        props.navigation.navigate('Root');
                                    else {
                                        console.error('could not create card'); // todo show message
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                })
                                .finally(() => {
                                    setDisableButton(false);
                                })
                        }}
                    />
                }

                {(detail && !readOnly) ?
                    <Button
                        style={{ marginBottom: 20 }}
                        onPress={() => {
                            if (detail && Platform.OS !== 'web') {
                                Alert.alert(lang.BACK_TEXT, '', [
                                    {
                                        text: lang.BACK_YES, onPress: () => {
                                            onDelete(cardid);
                                            props.navigation.navigate('Root');
                                            console.log('ha confermato la cancellazione');
                                        }
                                    },
                                    { text: lang.BACK_NO, onPress: () => null }
                                ]);
                            }
                        }}

                        type={ButtonType.danger}
                        title={lang.DELETE} /> : <></>
                }
            </ScrollView >

            <LoadingSpinnerModal visible={disableButton} />
            {/* </KeyboardAvoidingView> */}

            <LoadingSpinnerModal visible={disableButton} />
            {/* </KeyboardAvoidingView> */}
     
        </Screen >

    )

    
}

