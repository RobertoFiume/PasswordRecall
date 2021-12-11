import * as React from 'react'
import { Colors, LanguageContext, ThemeContext, Title, View, Screen, SectionList, Text } from '@infominds/react-native-components';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Expense, ExpenseDetail } from '../types';
import useApi from '../apis/useApi';
import ExpenseCard from '../components/ExpenseCard';
import moment from 'moment'
import 'moment/locale/it'
import 'moment/locale/de'
import InputDateTime from '../components/InputDateTime'
import { groupByDate } from '../utils/Filters';
import LoadingSpinnerModal from '../components/LoadingSpinnerModal';
import { formatPrice } from '../utils/PriceUtils';

export default function TabArchiveScreen(props: { navigation: any }) {
  const lang = React.useContext(LanguageContext);
  const colorScheme = React.useContext(ThemeContext);
  const theme = Colors[colorScheme];

  const [loading, setLoading] = useState(false);
  const [openDetailLoading, setOpenDetailLoading] = useState(false);

  let [data, setData] = useState<any>([]);

  const [to, setTo] = useState<Date | undefined>()
  const [from, setFrom] = useState<Date | undefined>()

  useFocusEffect(useCallback(() => {
    reload();
  }, []));

  React.useEffect(() => { reload(); console.log('filter ') }, [from, setFrom, to, setTo])

  const filterByDate = (list: Expense[]) => {
    console.log(from, to)

    if (from)
      return list.filter((item: Expense) => {
        console.log(new Date(item.date))
        if (from && to)
          return new Date(item.date).setHours(0, 0, 0, 0) >= new Date(from).setHours(0, 0, 0, 0) && new Date(item.date).setHours(0, 0, 0, 0) <= new Date(to).setHours(0, 0, 0, 0);
        else if (from)
          return new Date(item.date).setHours(0, 0, 0, 0) >= new Date(from).setHours(0, 0, 0, 0);
        else return true;
      })
    return list;
  }

  function getInitialFilterDate() {
    var d = new Date();
    var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    firstDay.setMonth(firstDay.getMonth() - 1);
    return firstDay;
  }

  function reload() {
    setLoading(true);
    useApi.getExpensesArchive().then((res) => {
      data = [];
      let tmp = filterByDate(res)
      tmp = groupByDate(tmp, lang.ID);
      for (const [key, value] of Object.entries(tmp)) {
        const tmpData = (value as any);
        data.push({ title: key, data: tmpData.data, sum: tmpData.sum, symbol: tmpData.symbol })
      }
      setData(data)
    }).catch(console.log).finally(() => setLoading(false));
  }

  const RenderItem = ({ item, index }: { item: Expense, index: number }) => (
    <ExpenseCard
      hasDot={false}
      onCardPress={() => {
        setOpenDetailLoading(true);
        console.log(item.id)
        useApi.getExpensesDetail(item.id)
          .then((res: ExpenseDetail) => {

            props.navigation.navigate('NewExpense', { detail: res, readOnly: true });
          })
          .catch((error) => console.error(error))
          .finally(() => setOpenDetailLoading(false));
      }}
      title={item.description}
      desc={item.price}
      desc2={item.description2}
      desc3={moment(new Date(item.date)).format('DD/MM/YYYY')}
    />
  );

  return (
    <Screen backgroundImage='ellipse6' style={{ padding: 0, marginBottom: 0 }} scrollable={false} >
      <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Title style={{ color: theme.text, fontSize: 25 }}>{lang.ARCHIVE}</Title>

        {/* // <TouchableOpacity style={{ marginTop: 15, marginRight: 8 }} onPress={() => setFilterVisible(true)}>
        //   <Icon size={28} name="filter" />
        // </TouchableOpacity>
        // <FilterModal
        //   isVisible={filterVisible}
        //   value={filter}
        //   close={(from: any, to: any) => {
        //     setFilterVisible(false);
        //     setFilter({ from: from, to: to })
        //     reload()  
        //   }}
        // /> */}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingLeft: 8, paddingRight: 8 }}>
        <View style={{ width: '50%' }}>
          <InputDateTime
            mode='date'
            value={from}
            placeholder={lang.FROM}
            onConfirm={setFrom}
            onDelete={() => { setFrom(undefined) }} />
        </View>
        <View style={{ width: '50%' }}>
          <InputDateTime
            placeholder={lang.TO}
            mode='date'
            value={to}
            onConfirm={setTo}
            onDelete={() => { setTo(undefined) }} />
        </View>
      </View>

      <SectionList
        style={{ padding: 8 }}
        sections={data}
        refreshing={loading}
        stickySectionHeadersEnabled={false}
        onRefresh={reload}
        renderItem={RenderItem}
        renderSectionFooter={() => (<View style={{ height: 15 }}></View>)}
        renderSectionHeader={({ section: { title, sum, symbol } }) => (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginLeft: 8, fontSize: 18 }}>{title}</Text>
            {sum ?
              <Text style={{ marginLeft: 8, fontSize: 18 }}>{lang.SUM} {formatPrice(sum)} {symbol}</Text>
              : <></>}
          </View>
        )}
        keyExtractor={(item: any, index: any) => index}
      />
      <View style={{ margin: 1 }}></View>

      <LoadingSpinnerModal visible={openDetailLoading} />
    </Screen >
  )
}