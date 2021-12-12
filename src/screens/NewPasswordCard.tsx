import * as React from 'react';
import {
    Screen, Text, Colors, Icon, LanguageContext, ThemeContext, Title,
    Input, Button, Note, Layout, ImValidators, LoadingIndicator, ButtonType
} from '@infominds/react-native-components';
import 'moment/locale/it'
import 'moment/locale/de'
import { TouchableOpacity, ScrollView, View, StyleSheet, Platform, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';
import Label from '../components/Label';
import { useCallback, useState } from 'react';
import LoadingSpinnerModal from '../components/LoadingSpinnerModal'
import SearchInputModal from '../components/SearchInputModal'
import PasswordInput from '../components/PasswordInput'
import SysData, {Card,CategoryType,CATEGORY_DEFAULT} from '../utils/sysdata';
import createGuid from "react-native-create-guid";


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
        let db: SysData = new SysData("prova2.db");

        db.openDatabse().then((result: boolean) => {
            console.debug('Opened database:',result); 
            db.getCategoryTypes()
                .then((categoryTypes: CategoryType[])  => {
                    setCategoryTypes(categoryTypes);
                }).catch((error) => {
                    console.error("Error on get categories",error);
                });
        })
        .catch((error) => {
            console.error("Error on open database",error);
        });

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
            setCategoryid(null);
            setCardid(null);
            setDescription(null);
            setUserName(null);
            setPassword (null);
            setNote(null);
            setPinCode(null);
            setUrl(null);
        }
    }

    React.useEffect(() => {
        setPasswordCardoModify();  
    }, []);  


    React.useEffect(() => {
       
    }, []);

    useFocusEffect(useCallback(() => {

    }, []));

    async function onSave(isUpdate: boolean = false) {
        console.debug("save");
        console.info('call save',isUpdate);

        let success: boolean = false;

        const card: Card = ({
           "categoryid": categoryType?.categoryid,
           "cardid":  cardid,
           "description": description,
           "url": url,
           "username": username,
           "password": password,
           "note": note
        });
          
        if (!isUpdate) {
          if (card.cardid == null) {
            await  createGuid()
              .then((guid) => {
                card.cardid = guid; 

                console.debug('guid:',guid);
              });
          }
        
          if (card.categoryid === null)
            card.categoryid = CATEGORY_DEFAULT;
        }

        const db: SysData = new SysData("prova2.db");

        await db.openDatabse().then((result: boolean) => {
           console.debug('Opened database:',result); 
         
           if (isUpdate) {
              success = db.updateCard(card)
                .then((result: boolean)  => {
                    console.debug('Updated card',result);
                    return result; 
                }).catch((error) => {
                    console.error("Error on update cards",error);
                });
            } 
            else {
              success = db.insertCard(card)
                .then((result: boolean)  => {
                    console.debug('Insert card',result);
                    return result; 
                }).catch((error) => {
                    console.error("Error on insert cards",error);
                });
            } 
         })
         .catch((error) => {
             console.error("Error on open database",error);
         });
     
         return success;
    }

    async function onDelete(cardid: string)
    {
        const db: SysData = new SysData("prova2.db");

        await db.openDatabse().then((result: boolean) => {
           console.debug('Opened database:',result); 
        
           db.deleteCard(cardid)
            .then((result: boolean)  => {
                console.debug('Delete card',result);
                return result; 
            }).catch((error) => {
                console.error("Error on delete cards",error);
            });
            
         })
         .catch((error) => {
             console.error("Error on open database",error);
         });
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
                <Note 
                    editable = {!readOnly}
                    placeholder={''}
                    value = {note}
                    onChangeText={(value: string) => {
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

  