import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default class CalendarScreen extends React.Component {
  
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    const date = new Date()
    this.makeCalendar(date.getFullYear(), date.getMonth()+1)
  }

  applyList (yyyy, mm, dateList) {
    const list = [
      { yyyy: 2020, mm: 3, dd: 2, name: '최과장', cost: 3500, color: 'green' },
      { yyyy: 2020, mm: 3, dd: 3, name: '최과장', cost: 3500, color: 'green' },
      { yyyy: 2020, mm: 3, dd: 3, name: '김과장', cost: 3500, color: 'purple' },
    ].filter((obj) => obj.yyyy === yyyy && obj.mm === mm)
    const costSummary = list.reduce((entry, obj) => {
      const costObj = entry[obj.name] || {}
      entry[obj.name] = {
        color: obj.color,
        totalCost: (costObj.totalCost || 0) + obj.cost,
        totalCnt: (costObj.totalCnt || 0) + 1
      }
      return entry
    }, {})
    return {
      costSummary,
      dateList: dateList.map((date) => {
        return {
          ...date,
          costList: list.filter((obj) => obj.dd === date.dd)
        }
      }) 
    }
  }

  makeCalendar (paramYyyy, paramMm) {
    const firstDay = new Date(paramYyyy, paramMm-1, 1)
    const lastDay = new Date(paramYyyy, paramMm, 0)
    const yyyy = firstDay.getFullYear()
    const mm = firstDay.getMonth() + 1
    
    const defaultDateObj = {}
    let dateList = Array.from(Array(firstDay.getDay())).map((obj) => defaultDateObj)
      .concat(Array.from(Array(lastDay.getDate())).map((obj, index) => { return { dd: index + 1 } }))
    if (lastDay.getDay() !== 0) {
      dateList = dateList.concat(Array.from(Array(6 - lastDay.getDay())).map((obj) => defaultDateObj))
    }
    const fullDate = lastDay.getDate() + firstDay.getDay()
    const weekCnt = fullDate % 7 === 0 ? (fullDate / 7) : Math.ceil(fullDate / 7)

    const applyResult = this.applyList(yyyy, mm, dateList)
    dateList = applyResult.dateList

    const result = {
      yyyy,
      mm,
      weekCnt,
      costSummary: applyResult.costSummary,
      dateList: dateList.reduce((entry, obj, index) => {
          const arrayIndex = Math.floor(index / 7)
          entry[arrayIndex] = entry[arrayIndex] || []
          entry[arrayIndex].push(obj)
          return entry
        }, [])
    }

    this.setState({
      ...result
    })
  }

  comma (x) {
    return String(x || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  render () {
    const { yyyy, mm, dateList, costSummary } = this.state
    const todayDate = new Date()
    if (!yyyy) return null
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 30 }}>
            <TouchableOpacity onPress={()=>this.makeCalendar(yyyy, mm-1)}>
              <Ionicons name={'ios-arrow-back'} size={22} style={{ marginLeft: 20 }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{ [yyyy, mm].join('.') }</Text>
            <TouchableOpacity onPress={()=>this.makeCalendar(yyyy, mm+1)}>
              <Ionicons name={'ios-arrow-forward'} size={22} style={{ marginRight: 20 }} />
            </TouchableOpacity>
          </View>
          {
            dateList.map((weekList, weekIndex) => {
              return (
                <View key={['week', weekIndex].join('_')} style={{ flexDirection: 'row', flex: 1, marginBottom: 20, minHeight: 50 }}>
                  {
                    weekList.map((dateObj, dateIndex) => {
                      return (
                        <View
                          key={['day', weekIndex, dateIndex].join('_')}
                          style={{ flexDirection: 'column', flex: 1, marginLeft: 3, marginRight: 3 }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 13 }}>{ dateObj.dd }</Text>
                            {
                              (yyyy === todayDate.getFullYear() && mm === todayDate.getMonth()+1 && dateObj.dd === todayDate.getDate())
                                ? <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'red' }}>Today</Text>
                                : null
                            }
                          </View>
                          {
                            (dateObj.costList || []).map((costObj, costIndex) => {
                              return (
                                <View key={['cost', weekIndex, dateIndex, costIndex].join('_')}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ height: 10, width: 10, backgroundColor: costObj.color, borderRadius: 50, marginRight: 2 }} />
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'grey' }}>{ costObj.name }</Text>
                                  </View>
                                  <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>{ this.comma(costObj.cost) }</Text>
                                </View>
                              )
                            })
                          }
                        </View>
                      )
                    })
                  }
                </View>
              )
            })
          }
          {
            (costSummary && Object.keys(costSummary).length)
              ? <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, borderStyle: 'solid', padding: 5, marginTop: 20 }}>
                  <Text style={{ color: 'grey', fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>요약</Text>
                </View>
              : null
          }
          {
            Object.keys(costSummary).map((name) => {
              const obj = costSummary[name]
              return (
                <View key={name} style={{ justifyContent: 'space-between', flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 15, width: 15, backgroundColor: obj.color, borderRadius: 50, marginRight: 10 }} />
                    <Text style={{ color: 'grey', fontSize: 20, fontWeight: 'bold' }}>{ name }</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 20 }}>{ this.comma(obj.totalCnt) } 건</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{ this.comma(obj.totalCost) } 원</Text>
                  </View>
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    );
  }
}

CalendarScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
});
