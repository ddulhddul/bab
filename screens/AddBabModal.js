import * as React from 'react';
import { Alert, ToastAndroid, TextInput, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DatetimePicker from '@react-native-community/datetimepicker'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import SqlUtil from '../SqlUtil.js'

export default class AddBabModal extends React.Component {

  constructor (props) {
    super(props)
    const defaultState = {
      costUnitList: [3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500],
      personList: [],
      yyyymmdd: this.getYYYYMMDDFromDate(new Date),
      user_id: undefined,
      cost: 0,
      showCalendar: false
    }
    const params = this.props.route.params || {}
    if (params.yyyy) defaultState.yyyymmdd = [
        params.yyyy,
        String(params.mm).padStart(2, '0'),
        String(params.dd).padStart(2, '0')
      ].join('')
    if (params.user_id) defaultState.user_id = params.user_id
    if (params.cost) defaultState.cost = params.cost
    if (params.bab_id) defaultState.bab_id = params.bab_id
    this.state = defaultState
    // console.log('this.props.navigation3', this.props.route.params)
  }

  async componentDidMount () {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      const userList = await SqlUtil.listUser()
      this.setState({
        personList: userList
      })
    })
  }

  componentWillUnmount () {
    this._unsubscribe()
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
    if (!date) return ''
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('')
  }
  
  async save () {
    const { bab_id, yyyymmdd, user_id, cost } = this.state
    if (!yyyymmdd) { ToastAndroid.show('날짜를 선택하세요.', ToastAndroid.SHORT); return }
    if (!user_id) { ToastAndroid.show('대상을 선택하세요.', ToastAndroid.SHORT); return }
    if (!cost) { ToastAndroid.show('금액을 입력하세요.', ToastAndroid.SHORT); return }
    const res = await SqlUtil.modifyBab({
      ...this.state,
      yyyy: yyyymmdd.substring(0,4),
      mm: yyyymmdd.substring(4,6),
      dd: yyyymmdd.substring(6,8)
    })
    // console.log('save result', res)
    if (res.rowsAffected) {
      ToastAndroid.show('저장되었습니다.', ToastAndroid.SHORT)
      this.props.navigation.goBack()
    } else {
      ToastAndroid.show('Error !', ToastAndroid.SHORT)
    }
  }

  async delete () {
    Alert.alert(
      '경고',
      '삭제 하시겠습니까?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const res = await SqlUtil.deleteBab({
              ...this.state
            })
            if (res.rowsAffected) {
              ToastAndroid.show('삭제되었습니다.', ToastAndroid.SHORT)
              this.props.navigation.goBack()
            } else {
              ToastAndroid.show('Error !', ToastAndroid.SHORT)
            }
          } },
      ],
      { cancelable: true }
    )    
  }

  render () {
    const { personList, costUnitList, showCalendar, bab_id, yyyymmdd, user_id, cost } = this.state
    return (
      <View style={styles.container}>
        <ScrollView style={{...styles.container, flex: 1}} contentContainerStyle={styles.contentContainer}>
          <View style={styles.unit}>
            <View style={styles.titleArea}>
              <Text style={{ fontSize: 20 }}>날짜</Text>
            </View>
            <View style={styles.inputArea}>
              <TouchableOpacity onPress={() => this.setState({ showCalendar: true })}>
                <View stye={{ flexDirection: 'row' }} >
                  <AntDesign name={'calendar'} size={20} style={{ color: 'black' }} />
                  <Text style={{ fontSize: 20 }}>{ (yyyymmdd||'') && String(yyyymmdd).replace(/(.{4})(.{2})(.{2})/, '$1-$2-$3') }</Text>
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
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                {
                  personList.map((person) => {
                    return (
                      <TouchableOpacity
                        key={['person', person.user_id].join('_')}
                        style={{ backgroundColor: person.user_id == user_id? 'red': 'grey', borderRadius: 50, marginRight: 2, marginBottom: 10 }}
                        onPress={()=>this.setState({ user_id: person.user_id })}
                      >
                        <Text style={{ padding: 5, margin: 3, fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                          {person.name}
                        </Text>
                      </TouchableOpacity>
                    )
                  })
                }
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('AddUserModal', { title: 'Modify' })}>
                  <AntDesign name={'pluscircle'} size={35} style={{ color: 'grey' }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.unit}>
            <View style={styles.titleArea}>
              <Text style={{ fontSize: 20 }}>금액</Text>
            </View>
            <View style={styles.inputArea}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                  costUnitList.map((costUnit) => {
                    return (
                      <TouchableOpacity
                        key={['cost', costUnit].join('_')}
                        style={{ backgroundColor: cost === costUnit? 'red': 'grey', borderRadius: 50, marginRight: 2, marginBottom: 10 }}
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
          {
            bab_id && <View style={{flex: 1, margin: 20}}>
              <Button onPress={() => this.delete()} title="삭제" />
            </View>
          }
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
