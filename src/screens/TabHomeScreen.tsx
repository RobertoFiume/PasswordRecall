import * as React from 'react';
import { Screen, Icon, ThemeContext, Colors, View, Title, Text, LanguageContext, SectionList, SearchBox } from '@infominds/react-native-components';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import SettingsModal from '../components/SettingsModal';
import 'moment/locale/it'
import 'moment/locale/de'
import { groupByDate } from '../utils/Filters';
import LoadingSpinnerModal from '../components/LoadingSpinnerModal'
import SysData, { Card, DATABASE_NAME } from '../utils/sysdata';
import PasswordCard from '../utils/PasswordCard';
import { RESULTS } from 'react-native-permissions';


export default function TabHomeScreen(props: { navigation: any, route: any }) {
  const lang = React.useContext(LanguageContext);
  const colorScheme = React.useContext(ThemeContext);
  const theme = Colors[colorScheme];

  const [loading, setLoading] = useState(false);
  const [openDetailLoading, setOpenDetailLoading] = useState(false);

  let [data, setData] = useState<any>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const [searchText, setSearchText] = useState<string>("");

  <SearchBox></SearchBox>


  function reload() {
    let db: SysData = new SysData(DATABASE_NAME);

     db.openDatabse().then((result: boolean) => {
        setLoading(true);  
        console.debug('Opened database:',result); 
        db.getCards()
          .then((section: CardSection[])  => {
            data = section;
            
            setData(data);
            setLoading(false);
         
            console.debug("has cards: ",data != []);
          }).catch((error) => {
            console.error("Error on get cards",error);
          });
      })
      .catch((error) => {
          console.error("Error on open database",error);
          setLoading(false);
      });
  }

  useFocusEffect(useCallback(() => {
    reload();
  }, []));

  function searchFilterFunction(searchText: string) {
    if (searchText === '') {
      return data;
    }
    else {
      const newData = data.reduce((result, sectionData) => {
        const { title, sum, symbol, data } = sectionData;

        const filteredData = data.filter(function(item) {
            const description = item.description ? item.description.toUpperCase() : ''.toUpperCase();

            return description.includes(searchText.toUpperCase());   
          
          }
        );
      
        // Restituisce la section che contiene l'item trovato
        if (filteredData.length !== 0) {
          result.push({ title,sum,symbol,data: filteredData});
        }
      
        return result;
      },[]);

      return newData;
    }
  }
  
  const RenderItem = ({ item, index }: { item: Card, index: number }) => (
    <PasswordCard
      hasDot={false}
     
      onCardPress={() => {
        const detail: Card = ({
          categoryid: item.categoryid,
          cardid: item.cardid,
          description: item.description,
          username: item.username,
          password: item.password,
          note: item.note,
          pincode: item.pincode,
          url: item.url
        });

        props.navigation.navigate('NewPasswordCard', { detail: detail, readOnly: false });
      }}
    
      categoryid = {item.categoryid}
      cardid = {item.cardid}
      description = {item.description}
      username = {item.username}
      password = {item.password}
      note = {item.note}
      pincode = {item.pincode}
      url = {item.url}
    />
  );

  return (
    <Screen backgroundImage='ellipse6' style={{ padding: 0, marginBottom: 0 }} scrollable={false} >
      <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Title style={{ color: theme.text, fontSize: 25 }}>{lang.PASSWORD_RECALL_TITLE}</Title>

        <TouchableOpacity style={{ marginTop: 15, marginRight: 8 }} onPress={() => setSettingsVisible(true)}>
          <Icon size={28} name="settings" />
        </TouchableOpacity>
        <SettingsModal
          isVisible={settingsVisible}
          close={() => setSettingsVisible(false)}
          onSettingsChange={reload}
          navigation={props.navigation}
        />
      </View>

      <Text>{searchText}</Text>

      <SearchBox 
        placeholder = {lang.SEARCH_BOX}
        onChangeText = { (text: string) => { setSearchText(text); } } 
      />
        
      <SectionList
        style = {{ padding: 8 }}
        sections = {searchFilterFunction(searchText)}
        refreshing = {loading}
        onRefresh = {reload}
        renderItem = {RenderItem}
        stickySectionHeadersEnabled = {false}
        renderSectionFooter = {() => (<View style={{ height: 15 }}></View>)}
        renderSectionHeader = {({ section: { title, count, symbol } }) => (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginLeft: 8, fontSize: 18 }}>{title}</Text>
            {count ?
              <Text style={{ marginLeft: 8, fontSize: 18 }}>{lang.COUNT} {count} {symbol}</Text> : <></>
            }
          </View>
        )}
        keyExtractor={(_item: any, index: any) => index}
      />

      <LoadingSpinnerModal visible={openDetailLoading} />

      <View style={{ margin: 1 }}></View>
    </Screen>
  )
}