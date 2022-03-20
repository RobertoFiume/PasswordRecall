import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Image , Alert} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage"
import { Colors, Button, Input,  LoadingIndicator, Text, View, Layout, Icon, LanguageContext} from '@infominds/react-native-components';
import { useColorScheme } from '@infominds/react-native-components';

import PasswordInput from '../../components/PasswordInput';
import SysData, {DATABASE_NAME} from "../../utils/sysdata";
import ReactNativeBiometrics   from 'react-native-biometrics';


Login.defaultProps = {
  getUserInfo: true
}

export default function Login(props: {
  style: any,
  onLoginClick: () => void,
  customLoginFunction?: (username: string, password: string) => Promise<any>,
 
  iconSource?: any,
  iconStyle?: any,
  
  getUserInfo?: boolean
}) {
  const lang = React.useContext(LanguageContext);
  const [isLoading, setLoading] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  useEffect(() => {
    resetErrors();

    AsyncStorage.multiGet(['username', 'password']).then((val: any) => {
      console.debug('get data: ', val);
      if (val.length !== 2) {
        setLoading(false);
        return;
      }

      let user = val[0][1], pass = val[1][1];
      console.debug("last user: ", user, pass);

      if (user) 
      {
        setUsername(user);
        setPassword(pass);

        setLoading(false);

        requestAuthentication();
      } 
      else {
        setLoading(false)
      }
    }).catch(() => { setLoading(false) });
  }, []);

  let resetErrors = () => {
    setUsernameError(false);
  }

  async function ExistsUser(username: string, password: string): boolean
  {
    let success: boolean = false;
    const db: SysData = new SysData(DATABASE_NAME);

    await db.openDatabse().then((result: boolean) => {
      console.debug('Opened database:',result); 
    
      success = db.existsUser(username,password)
          .then((result: boolean)  => {
              return result; 
          }).catch((error) => {
              console.error("Error: ",error);
          });
      })
      .catch((error) => {
          console.error("Error on open database",error);
      });
    return success;
  }

  async function AddNewUser(username: string, password: string): boolean
  {
    let success: boolean = false;
    const db: SysData = new SysData(DATABASE_NAME);

    await db.openDatabse().then((result: boolean) => {
      console.debug('Opened database:',result); 
      
      success = db.insertUser(username,password)
          .then((result: boolean)  => {
              return result; 
          }).catch((error) => {
              console.error("Error: ",error);
          });
      })
      .catch((error) => {
          console.error("Error on open database",error);
      });

    return success;
  }


  function requestAuthenticationExt(): void
  {
    let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
    let payload = epochTimeSeconds + 'some message'

    ReactNativeBiometrics.createSignature({
        promptMessage: 'Sign in',
        payload: payload
      })
      .then((resultObject) => {
        const { success, signature } = resultObject

        if (success) {
          console.debug('Biometric ok');
          //verifySignatureWithServer(signature, payload)
        }
      })
  }

  async function requestAuthentication(): void 
  {
    console.debug('Request biometrics');
    let success: boolean = false;

    const {available,biometryType} = await ReactNativeBiometrics.isSensorAvailable();

    if (available && biometryType === ReactNativeBiometrics.TouchID) {
      console.debug('TouchID is supported');
      success = true;
    } 
    else if (available && biometryType === ReactNativeBiometrics.FaceID) {
      console.debug('FaceID is supported');
      success = true;
    } 
    else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
      console.debug('Biometrics is supported');
      success = true;
    } 
    else {
      console.debug('Biometrics not supported');
      success = false;
    }

    if (success) {
      ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then((resultObject) => {
          const { success } = resultObject

          if (success) {
            console.debug('successful biometrics provided');
            props.navigation.navigate('Root');
          } 
          else {
            console.debug('user cancelled biometric prompt')
          }
        })
        .catch(() => {
          console.debug('biometrics failed')
        });
    }
  }

  let onLoginButtonPress = () => {
    resetErrors();
    setLoading(true);

    ExistsUser(username,password)
      .then((result: boolean) => {
          if (result)
          {
            updateLoginData(username,password);

            props.navigation.navigate('Root');
          }
          else {
            Alert.alert(lang.INVALID_USER, '', [
              {
                  text: "OK", onPress: () => {
                      
                  }
              }
            ]);
          }
      })
      .catch((error) => {
          console.error(error);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  function updateLoginData(username: string, password: string): void
  {
    setUsername(username);
    setPassword(password);

    AsyncStorage.setItem('username', username);
    AsyncStorage.setItem('password', password);

    console.debug('login: ' ,username,password);
  }
  
  
  let onAddNewUserButtonPress = () => {
    resetErrors();
    setLoading(true);

    username ? AsyncStorage.setItem('username', username) : setUsernameError(true);
    AsyncStorage.setItem('password', password);

    AddNewUser(username,password)
      .then((result: boolean) => {
        
          if (result)
          {
            updateLoginData(username,password);
            props.navigation.navigate('Root');
          }
          else {
            Alert.alert(lang.INVALID_USER, '', [
              {
                  text: "OK", onPress: () => {
                      
                  }
              }
            ]); 
          }
      })
      .catch((error) => {
          console.error(error);
      })
      .finally(() => {
        setLoading(false);
      })
  }


  const ScreenIcon = () => {
    let source = props.iconSource;
    if (!source) {
      if (colorScheme == 'dark')
        source = require('./assets/infominds_tree_light.png');
      else
        source = require('./assets/infominds_tree_dark.png');
    }

    let len = Layout.isSmallDevice ? 133 : 200

    return (<Image
      style={[{ width: len, height: len, margin: 50, marginTop: 5 }, props?.iconStyle]}
      source={source} />)
  }


  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', height: Layout.window.height }}>
        <LoadingIndicator isVisible={true} />
      </View>
    )

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <StatusBar
      translucent={false}
      backgroundColor={theme.background}
      barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
    />
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: Colors[colorScheme].background }}>
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }} keyboardShouldPersistTaps='handled'>
        <View style={[styles.container, { marginTop: -65, left: 0, right: 0, backgroundColor: Colors[colorScheme].background }]} >
          <View style={[{ backgroundColor: Colors[colorScheme].background }, styles.login]}>

              <ScreenIcon></ScreenIcon>         
              <Input
                placeholder={lang.USERNAME}
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.inputBackground,
                  borderColor: usernameError ? Colors.error : theme.inputBorder
                }]}
                onChangeText={setUsername}
                value={username}></Input>

              <PasswordInput
                placeholder={lang.PASSWORD}
                style={[styles.input, {
                  color: theme.text,
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  marginBottom: 0
                }]}
                onChangeText={(text) => setPassword(text)}
                value={password} />

              <Button
                style={styles.loginButton}
                title="Login"
                onPress={onLoginButtonPress} />
              
              <Button
                style={styles.loginButton}
                title={lang.REGISTRATION}
                onPress={onAddNewUserButtonPress} 
              />
                   
          </View>
        </View>

      </ScrollView>
    </View>
  </SafeAreaView>


                  
     
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    width: '100%',
  },
  loginButton: {
    width: '100%',
    marginTop: 20
  },
  loadingContainer: {
    flex: 1,
    alignContent: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center'
  },
  errorView: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 20
  },
  container: {
    height: '100%',
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center'
  },
  login: {
    width: '100%',
    maxWidth:350,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'center'
  }
});
