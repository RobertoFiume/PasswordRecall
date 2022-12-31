import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { DevSettings, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {
  Colors, SwitchDarkMode, Text, Button,
  ChangeThemeContext, ThemeContext, ChangeLanguageContext, LanguageContext, Title
} from '@infominds/react-native-components'
import { getLanguageJSON } from '../utils/LanguageUtils'
import Separator from '../components/Separator'
 
import DeviceInfo from 'react-native-device-info';
import devEnviroments from '../devEnviroments';
import PickerModal from '../components/PickerModal'
import Share from 'react-native-share';
import SysData, {DATABASE_NAME } from '../utils/sysdata';
import RNFS from 'react-native-fs';
import Moment from 'moment';
import DocumentPicker, {DirectoryPickerResponse,DocumentPickerResponse,types} from 'react-native-document-picker'


const packageJson = require('../../package.json');

export default function Settings(props: { navigation: any, onSettingsChange: () => void, isSettingsOpen: boolean }) {
  const lang: any = useContext(LanguageContext);
  const setLanguage = useContext(ChangeLanguageContext);
  const colorScheme = useContext(ThemeContext);
  const setTheme = useContext(ChangeThemeContext);

  const isDarkMode = (colorScheme === 'dark')

  const [isEnabled, setIsEnabled] = useState(isDarkMode);
  const [selectedLanguage, setSelectedLanguage] = useState(lang.ID);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsEnabled(isDarkMode)

    AsyncStorage.getItem('lang').then(res => { if (res) setSelectedLanguage(res) });
    AsyncStorage.getItem('username').then((res: any) => setUsername(res));
    AsyncStorage.getItem('password').then((res: any) => setPassword(res));
  }, [props.isSettingsOpen]);

  function toggleSwitch() {
    setIsEnabled(previousState => !previousState);

    if (colorScheme === 'light') {
      setTheme('dark');
      AsyncStorage.setItem('theme', 'dark').then(() => {
        if (Platform.OS === 'ios') DevSettings.reload()
      });
    } else {
      setTheme('light');
      AsyncStorage.setItem('theme', 'light').then(() => {
        if (Platform.OS === 'ios') DevSettings.reload()
      });
    }
  }

  const PickerLanguageV2 = () => {
    const languages = [
      { label: 'Deutsch', value: 'de' },
      { label: 'Italiano', value: 'it' },
      { label: 'English', value: 'en' },
    ];
    return (
      <View style={{ flex: 1 }}>
        <PickerModal
          value={() => languages.find((item) => item.value === selectedLanguage)}
          onSelect={(language: any) => {
            if (language) {
              setLanguage(getLanguageJSON(language.value));
              setSelectedLanguage(language.value);
              AsyncStorage.setItem('lang', language.value);
            }
          }}
          renderSelected={(item: any) => item?.label}
          renderItemContent={({ item }: { item: any }) => <Text>{item.label}</Text>}
          data={languages} />
      </View >
    )
  }

  async function backupDatabase(fileName: String): boolean {
    let success: boolean = false;
  
    const databaseFile = RNFS.DocumentDirectoryPath + '/' + DATABASE_NAME;
    console.debug('Backup database');
  
    await RNFS.copyFile(databaseFile, fileName)
        .then((result: boolean) => {
          success = result;
          console.debug('File copied');
        })
        .catch((error) => {
          success = false;
          throw new Error("Error on copy file: " + error.message); //raise error
        });
   
    return success;
  }


  async function shareToFiles(fileName: String): boolean {
     let success: boolean = false;

     const shareOptions = {
        title: 'Share file',
        failOnCancel: false,
        saveToFiles: true,
        urls: [fileName],
      };

      try {
        await Share.open(shareOptions);
        success = true;
      }  
      catch (error) {
        success = false
      }

      return success;
  };

  const OnBackupDataClick = () => {
    let backupFile = RNFS.DocumentDirectoryPath + '/Backup ' + Moment(new Date).format('YYYY.MM.DD HH.mm.ss') + '.rpbk';
    
    backupDatabase(backupFile)
      .then((result: boolean) => {
        shareToFiles(backupFile)
          .then((result: boolean) => {
             console.debug("Shared file");
            
            RNFS.unlink(backupFile);
          });
      })
      .catch((error) => {
        success = false
        console.error("Error: ", error);

        throw new Error(error); //raise error
      });
  }

  const OnRestoreDataClick = async () => {
    
    try {
      const fileSelected = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory'
      });

      const deleteDabaseFile = RNFS.DocumentDirectoryPath + '/' + DATABASE_NAME;
      await RNFS.unlink(deleteDabaseFile);

      const deleteDatabaseShm = RNFS.DocumentDirectoryPath + '/PasswordRecall.db-shm';
      await RNFS.unlink(deleteDatabaseShm);

      const deleteDatabaseWal = RNFS.DocumentDirectoryPath + '/PasswordRecall.db-wal';
      await RNFS.unlink(deleteDatabaseWal);

      console.debug("File picker: ", fileSelected);
      const databaseFile = RNFS.DocumentDirectoryPath + '/' + DATABASE_NAME;

      const decodedFileURI = decodeURIComponent(fileSelected.fileCopyUri); // Necessaria se ci sono spazi nel nome del file
      await RNFS.copyFile(decodedFileURI,databaseFile);

      //TODO: fare il refresh dell'app per caricare il nuovo db
    } 
    catch (error) {
      console.error("Error: ", error);
    }

  }

  const OnLogOut = async () => {
    props.navigation.replace('Login')
  }

  return (
    <View style={{ margin: 0 }} >
      <TouchableOpacity>
        <TouchableWithoutFeedback>
          <View style={{ padding: 20 }}>
            {devEnviroments.enableIntroSlider && <>
              <Button
                title={'Show tutorial'}
                style={{ backgroundColor: Colors.grey, margin: 0, marginBottom: 5, padding: 3 }}
                onPress={() => {
                  AsyncStorage.removeItem('intro').then(() => {
                    if (Platform.OS === 'web')
                      window.location.reload();
                    else
                      DevSettings.reload();
                  });
                }}
              />
              <Separator />
            </>}

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text>{lang.SETTINGS_DARKMODE}</Text>
              <SwitchDarkMode
                style={{ flex: 1, alignSelf: 'flex-end' }}
                onValueChange={() => toggleSwitch()}
                value={isEnabled}
              />
            </View>

            <Separator />

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{lang.SETTINGS_LANGUAGE}</Text>
              <PickerLanguageV2 />
            </View>

            <Separator />

            <Button 
              style = {styles.buttonLogout}
              title = "Logout"
              onPress = {() => OnLogOut()}
            />

           <Button 
             style = {styles.buttonBackupAndRestore}
             title = "Backup"
             onPress = {() => OnBackupDataClick()}
           />

           <Button 
             style = {styles.buttonBackupAndRestore}
             title = "Restore"
             onPress = {() => OnRestoreDataClick()}
           />

            <Text style={{ marginBottom: 20 }}>Info</Text>

            {
              Platform.OS != 'web' ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.info}>{lang.SETTINGS_VERSION}: </Text>
                  <Text style={styles.info}>{packageJson.name} v{DeviceInfo.getVersion()}</Text>
                </View>
                :
                <View></View>
            }

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.info}>{lang.SETTINGS_LICENSE}: </Text>
          
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.info}>{lang.USERNAME}: </Text>
              <Text style={styles.info}>{username}</Text>
            </View>


          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </View >
  )
}

const styles = StyleSheet.create({
  info: {
    color: Colors.icon
  },
  infoDetail: {
    color: Colors.icon,
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right'
  },
  buttonBackupAndRestore:
  {
    backgroundColor: "#00A1FE",
  },
  buttonLogout:
  {
    backgroundColor: Colors.red,
  }
});
