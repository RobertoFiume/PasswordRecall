import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { DevSettings, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {
  Colors, SwitchDarkMode, Text, Button,
  ChangeThemeContext, ThemeContext, ChangeLanguageContext, LanguageContext
} from '@infominds/react-native-components'
import { getLanguageJSON } from '../utils/LanguageUtils'
import Separator from '../components/Separator'
import { LicenseGlobals, LogoutButton } from '@infominds/react-native-license'
import useApi from '../apis/useApi';
import createPersistedState from 'use-persisted-state';
import DeviceInfo from 'react-native-device-info';
import devEnviroments from '../devEnviroments';
import { Company } from '../types';
import PickerModal from '../components/PickerModal'

const packageJson = require('../../package.json');

const useCounterState = createPersistedState('mandantID');

export default function Settings(props: { navigation: any, onSettingsChange: () => void, isSettingsOpen: boolean }) {
  const lang: any = useContext(LanguageContext);
  const setLanguage = useContext(ChangeLanguageContext);
  const colorScheme = useContext(ThemeContext);
  const setTheme = useContext(ChangeThemeContext);

  const isDarkMode = (colorScheme === 'dark')

  const [isEnabled, setIsEnabled] = useState(isDarkMode);
  const [selectedLanguage, setSelectedLanguage] = useState(lang.ID);
  const [selectedCompany, setSelectedCompany] = useCounterState<Company | undefined>(undefined);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [companies, setCompanies] = useState<Company[]>([]);

  console.debug(companies);

  useEffect(() => {
    setIsEnabled(isDarkMode)

    useApi.getCompaniesOfUser().then((res: Company[]) => {
      setCompanies(res);
      if (selectedCompany === undefined && res.length > 0)
        setSelectedCompany(res[0])
    }).catch(console.error)
      .finally(() =>
        AsyncStorage.getItem('selectedCompany').then(res => { if (res) setSelectedCompany(JSON.parse(res)); })
      );

    AsyncStorage.getItem('selectedCompany').then(res => { if (res) setSelectedCompany(JSON.parse(res)); });
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

  function getNewToken(company?: string, langstr?: string) {
    const useCompany = company ?? selectedCompany?.id;
    const useLang = langstr ?? selectedLanguage;

    useApi.login(username, password ?? '', useLang, useCompany).then(token => {
      LicenseGlobals.token = token;
      props.onSettingsChange();
    }).catch(err => console.error(err));
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
              getNewToken(undefined, language.value);
            }
          }}
          renderSelected={(item: any) => item?.label}
          renderItemContent={({ item }: { item: any }) => <Text>{item.label}</Text>}
          data={languages} />
      </View >
    )
  }

  const PickerCompaniesV2 = () => (
    <View style={{ flex: 1 }}>
      <PickerModal
        value={selectedCompany}
        onSelect={(value: Company) => {
          if (value) {
            setSelectedCompany(value);
            LicenseGlobals.mandantId = value.id;
            AsyncStorage.setItem('code', value.id);
            AsyncStorage.setItem('selectedCompany', JSON.stringify(value));

            console.log(value)
            getNewToken(value.id);
          }
        }}
        renderSelected={(item: Company) => item?.description}
        renderItemContent={({ item }: { item: Company }) => <Text>{item.description}</Text>}
        data={companies} />
    </View >
  )

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

            <LogoutButton logoutNavigation={() => {
              AsyncStorage.removeItem('selectedCompany');
              props.navigation.replace('Login')
            }} />

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
              <Text style={styles.info}>{LicenseGlobals.license}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.info}>{lang.SETTINGS_SERVER}: </Text>
              <Text style={styles.infoDetail}>{LicenseGlobals.baseUrl}</Text>
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
  }
});
