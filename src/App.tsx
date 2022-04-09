import React, { useEffect } from "react";
import { KeyboardAvoidingView, LogBox, Platform, StatusBar, StyleSheet, View } from 'react-native';
import Navigation from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  LanguageContext, ChangeLanguageContext, Colors, ThemeContext,
  ChangeThemeContext, useColorScheme, OfflineNotice
} from '@infominds/react-native-components'
import createPersistedState from 'use-persisted-state';
import getLanguage from './hooks/useLanguage';
import initLoad from './utils/InitLoad';
import SplashScreen from 'react-native-splash-screen';
import devEnviroments from './devEnviroments';
import Analytics from 'appcenter-analytics';
import IntroSlider from './components/IntroSlider';
import slides from './Intro';

const useThemeState = createPersistedState('useThemeState');
const useLanguageState = createPersistedState('useLanguageState');
const useShowIntroState = createPersistedState('useShowIntroState');

export default function App() {
  const initColorScheme = useColorScheme();
  const theme = Colors[initColorScheme];

  const [colorScheme, setTheme] = useThemeState(initColorScheme);
  const [lang, setLanguage] = useLanguageState(getLanguage());
  const [showIntro, setShowIntro] = useShowIntroState(devEnviroments.enableIntroSlider);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      LogBox.ignoreAllLogs();
      Analytics.setEnabled(devEnviroments.appCenterAnalytics)
    }

    initLoad(setLanguage, setTheme)
      .then(() => { if (Platform.OS !== 'web') SplashScreen.hide() });
  }, []);

  if (showIntro) return <IntroSlider data={slides} onDone={() => setShowIntro(false)} />;

  return (
    <SafeAreaProvider>
      <LanguageContext.Provider value={lang}>
        <ChangeLanguageContext.Provider value={setLanguage}>
          <ThemeContext.Provider value={colorScheme}>
            <ChangeThemeContext.Provider value={setTheme}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container} >

                <View style={[styles.screen, { backgroundColor: theme.background }]}>
                  {Platform.OS !== 'web' ? <OfflineNotice text={lang.NO_INTERNET} /> : <></>}
                  <Navigation colorScheme={colorScheme} />

                  <StatusBar
                    backgroundColor={Colors[colorScheme].background}
                    barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
                </View>
              </KeyboardAvoidingView>
            </ChangeThemeContext.Provider>
          </ThemeContext.Provider>
        </ChangeLanguageContext.Provider>
      </LanguageContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  screen: {
    height: '100%'
  },
  app: {
    marginHorizontal: "auto",
    width: '100%',
    marginTop: 30,
    maxWidth: 500
  }
});
