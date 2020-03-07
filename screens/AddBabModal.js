import * as React from 'react';
import { TextInput, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DatetimePicker from '@react-native-community/datetimepicker'
import { Ionicons, AntDesign } from '@expo/vector-icons';

export default class AddBabModal extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      costUnitList: [3000, 3500, 4000, 4500, 5000],
      personList: [
        { personId: '1', name: '사람1' },
        { personId: '2', name: '사람2' },
        { personId: '3', name: '사람3' },
      ],
      yyyymmdd: this.getYYYYMMDDFromDate(new Date),
      personId: undefined,
      cost: 0,
      showCalendar: false
    }
  }

  onCalendarChange (selectedDate) {
    this.setState({
      showCalendar: false,
      yyyymmdd: this.getYYYYMMDDFromDate(selectedDate || new Date())
    })
  }

  getDateFromYYYYMMDD (yyyymmdd) {
    const yyyy_mm_dd = String(yyyymmdd).replace(/(.{4})(.{2})(.{2})/, '$1-$2-$3')
    return new Date(yyyy_mm_dd)
  }

  getYYYYMMDDFromDate (date) {
    if (!date) return null
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('')
  }
  
  save () {

  }

  render () {
    const { personList, costUnitList, showCalendar, yyyymmdd, personId, cost } = this.state
    return (
      <View style={styles.container}>
        <ScrollView style={{...styles.container, flex: 1}} contentContainerStyle={styles.contentContainer}>
          <View style={styles.unit}>
            <View style={styles.titleArea}>
              <Text style={{ fontSize: 20 }}>날짜</Text>
            </View>
            <View style={styles.inputArea}>
              <TouchableOpacity onPress={() => this.setState({ showCalendar: true })}>
                <View stye={{ flexDirection: 'row', flex: 1 }} >
                  <AntDesign name={'calendar'} size={20} style={{ color: 'black' }} />
                  <Text style={{ fontSize: 20 }}>{ String(yyyymmdd).replace(/(.{4})(.{2})(.{2})/, '$1-$2-$3') }</Text>
                </View>
              </TouchableOpacity>
              { showCalendar && <DatetimePicker value={this.getDateFromYYYYMMDD(yyyymmdd)} onChange={(event, selectedDate) => this.onCalendarChange(selectedDate)} /> }
            </View>
          </View>

          <View style={styles.unit}>
            <View style={styles.titleArea}>
              <Text style={{ fontSize: 20 }}>대상</Text>
            </View>
            <View style={styles.inputArea}>
              <View style={{ flexDirection: 'row' }}>
                {
                  personList.map((person) => {
                    return (
                      <TouchableOpacity
                        key={['person', person.personId].join('_')}
                        style={{ backgroundColor: person.personId === personId? 'red': 'grey', borderRadius: 50, marginRight: 2 }}
                        onPress={()=>this.setState({ personId: person.personId })}
                      >
                        <Text style={{ padding: 5, margin: 3, fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                          {person.name}
                        </Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            </View>
          </View>

          <View style={styles.unit}>
            <View style={styles.titleArea}>
              <Text style={{ fontSize: 20 }}>금액</Text>
            </View>
            <View style={styles.inputArea}>
              <View style={{ flexDirection: 'row' }}>
                {
                  costUnitList.map((costUnit) => {
                    return (
                      <TouchableOpacity
                        key={['cost', costUnit].join('_')}
                        style={{ backgroundColor: cost === costUnit? 'red': 'grey', borderRadius: 50, marginRight: 2 }}
                        onPress={()=>this.setState({ cost: costUnit })}
                      >
                        <Text style={{ padding: 5, margin: 3, fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                          {costUnit}
                        </Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, margin: 20}}>
            <Button onPress={() => this.props.navigation.goBack()} title="취소" />
          </View>
          <View style={{flex: 1, margin: 20}}>
            <Button onPress={() => this.save()} title="저장" />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  unit: {
    // justifyContent: 'center',
    flexDirection: 'row',
    margin: 10,
    marginTop: 30
  },
  titleArea: {
    flex: 2
  },
  inputArea: {
    flex: 8,
    // alignItems: 'center',
    // alignSelf: 'center',
    // alignContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
});
