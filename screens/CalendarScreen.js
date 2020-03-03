import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class CalendarScreen extends React.Component {
  
  constructor (props) {
    super(props)
    const dateOBj = this.makeCalendar()
    console.log('dateOBj', dateOBj)
    this.state = { ...dateOBj }
  }

  applyList (dateList) {
    const list = [
      { yyyy: 2020, mm: 3, dd: 2, name: '최과장', cost: 3500 },
      { yyyy: 2020, mm: 3, dd: 3, name: '최과장', cost: 3500 },
      { yyyy: 2020, mm: 3, dd: 3, name: '김과장', cost: 3500 },
    ]
    return {
      dateList: dateList.map((date) => {
        return {
          ...date,
          costList: list.filter((obj) => obj.dd === date.dd)
        }
      }) 
    }
  }

  makeCalendar () {
    const date = new Date()
    const yyyy = date.getFullYear()
    const mm = date.getMonth()
    const firstDay = new Date(yyyy, mm, 1)
    const lastDay = new Date(yyyy, mm+1, 0)
    
    const defaultDateObj = {}
    let dateList = Array.from(Array(firstDay.getDay())).map((obj) => defaultDateObj)
      .concat(Array.from(Array(lastDay.getDate())).map((obj, index) => { return { dd: index + 1 } }))
    if (lastDay.getDay() !== 0) {
      dateList = dateList.concat(Array.from(Array(6 - lastDay.getDay())).map((obj) => defaultDateObj))
    }
    const fullDate = lastDay.getDate() + firstDay.getDay()
    const weekCnt = fullDate % 7 === 0 ? (fullDate / 7) : Math.ceil(fullDate / 7)

    const applyResult = this.applyList(dateList)
    dateList = applyResult.dateList

    return {
      yyyy,
      mm: mm + 1,
      weekCnt,
      dateList: dateList.reduce((entry, obj, index) => {
          const arrayIndex = Math.floor(index / 7)
          entry[arrayIndex] = entry[arrayIndex] || []
          entry[arrayIndex].push(obj)
          return entry
        }, [])
    }
  }

  render () {
    const { yyyy, mm, dateList } = this.state
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 30 }}>{ [yyyy, mm].join('.') }</Text>
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
                          style={{ flexDirection: 'column', flex: 1 }}
                        >
                          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{ dateObj.dd }</Text>
                          {
                            (dateObj.costList || []).map((costObj, costIndex) => {
                              return (
                                <Text key={['cost', weekIndex, dateIndex, costIndex].join('_')}>
                                  { [costObj.name, costObj.cost].join(' ') }
                                </Text>
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
