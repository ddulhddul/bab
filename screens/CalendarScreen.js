import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import SqlUtil from '../SqlUtil.js'

export default class CalendarScreen extends React.Component {
  
  constructor (props) {
    super(props)
    this.state = {
      personList: [
        { user_id: 1, name: '사람1' },
        { user_id: 2, name: '사람2' },
        { user_id: 3, name: '사람3' },
      ],
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.initCalendar()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }


  async initCalendar () {
    // console.log('listBab', await SqlUtil.listBab())
    const { yyyy, mm } = this.state
    if (yyyy) {
      this.makeCalendar(yyyy, mm)
    } else {
      const date = new Date()
      this.makeCalendar(date.getFullYear(), date.getMonth()+1)
    }
  }

  async applyList (yyyy, mm, dateList) {
    // const list = [
    //   { bab_id: '1', yyyy: 2020, mm: 3, dd: 2, user_id: '1', cost: 3500, color: 'green' },
    //   { bab_id: '2', yyyy: 2020, mm: 3, dd: 3, user_id: '1', cost: 3500, color: 'green' },
    //   { bab_id: '3', yyyy: 2020, mm: 3, dd: 4, user_id: '1', cost: 3500, color: 'green' },
    //   { bab_id: '4', yyyy: 2020, mm: 3, dd: 5, user_id: '1', cost: 3500, color: 'green' },
    //   { bab_id: '5', yyyy: 2020, mm: 3, dd: 4, user_id: '2', cost: 3500, color: 'blue' }
    // ]
    let list = await SqlUtil.listBab()
    list = list.filter((obj) => obj.yyyy === yyyy && obj.mm === mm)
    const costSummary = list.reduce((entry, obj) => {
      const costObj = entry[obj.user_id] || {}
      entry[obj.user_id] = {
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

  async makeCalendar (paramYyyy, paramMm) {
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

    const applyResult = await this.applyList(yyyy, mm, dateList)
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

  callModal (param) {
    this.props.navigation.navigate('AddBabModal', { ...param, title: !param? 'Add': 'Modify' })
  }

  render () {
    const { personList, yyyy, mm, dateList, costSummary } = this.state
    const todayDate = new Date()
    if (!yyyy) return null
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 30, marginTop: 30 }}>
          <TouchableOpacity onPress={()=>this.makeCalendar(yyyy, mm-1)}>
            <Ionicons name={'ios-arrow-back'} size={25} style={{ marginLeft: 20 }} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>{ [yyyy, '년'].join('') }</Text>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{ [mm, '월'].join('') }</Text>
          </View>
          <TouchableOpacity onPress={()=>this.makeCalendar(yyyy, mm+1)}>
            <Ionicons name={'ios-arrow-forward'} size={25} style={{ marginRight: 20 }} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
                                  <TouchableOpacity onPress={()=>this.callModal(costObj)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                      <View style={{ height: 10, width: 10, backgroundColor: costObj.color, borderRadius: 50, marginRight: 2 }} />
                                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'grey' }}>
                                        { (personList.find((person) => person.user_id == costObj.user_id) || {}).name }
                                      </Text>
                                    </View>
                                    <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>{ this.comma(costObj.cost) }</Text>
                                  </TouchableOpacity>
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
                  <Text style={{ color: 'grey', fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>월 요약</Text>
                </View>
              : null
          }
          {
            Object.keys(costSummary).map((user_id) => {
              const obj = costSummary[user_id]
              return (
                <View key={user_id} style={{ justifyContent: 'space-between', flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 15, width: 15, backgroundColor: obj.color, borderRadius: 50, marginRight: 10 }} />
                    <Text style={{ color: 'grey', fontSize: 20, fontWeight: 'bold' }}>
                      { (personList.find((person) => person.user_id == user_id) || {}).name }
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 20 }}>{ this.comma(obj.totalCnt) } 건</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{ this.comma(obj.totalCost) } 원</Text>
                  </View>
                </View>
              )
            })
          }
          <View style={{ height: 100 }}/>
        </ScrollView>
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          right: 20,
          bottom: 20
        }}>
          <TouchableOpacity onPress={()=>this.callModal()}>
            <AntDesign name={'pluscircle'} size={40} style={{ color: 'red' }} />
          </TouchableOpacity>
        </View>
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
