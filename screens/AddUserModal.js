import * as React from 'react';
import { Alert, ToastAndroid, TextInput, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import SqlUtil from '../SqlUtil.js'

export default class AddUserModal extends React.Component {

  constructor (props) {
    super(props)
    let defaultState = {
      colorList: SqlUtil.listColor(),
      user_id: '', name: '', color: ''
    }
    const params = this.props.route.params || {}
    if (params.user_id) {
      defaultState = {
        ...defaultState,
        ...params
      }
    }
    this.state = defaultState
  }
  
  async save () {
    const { name, color } = this.state
    if (!name) { ToastAndroid.show('이름을 입력하세요.', ToastAndroid.SHORT); return }
    if (!color) { ToastAndroid.show('색을 선택하세요.', ToastAndroid.SHORT); return }
    const res = await SqlUtil.modifyUser({
      ...this.state
    })
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
            const res = await SqlUtil.deleteUser({
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
    const { colorList, user_id, name, color } = this.state
    return (
      <View style={styles.container}>
        <ScrollView style={{...styles.container, flex: 1}} contentContainerStyle={styles.contentContainer}>
          <View style={styles.unit}>
            <View style={styles.titleArea}>
              <Text style={{ fontSize: 20 }}>이름</Text>
            </View>
            <View style={styles.inputArea}>
              <TextInput
                style={{ height: 30, borderColor: 'gray', borderBottomWidth: 1 }}
                onChangeText={text => this.setState({ name: text })}
                value={name}
              />
            </View>
          </View>

          <View style={styles.unit}>
            <View style={styles.titleArea}>
              <Text style={{ fontSize: 20 }}>색상</Text>
            </View>
            <View style={styles.inputArea}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                  colorList.map((targetColor) => {
                    return (
                      <TouchableOpacity
                        key={targetColor}
                        style={{ margin: 10, justifyContent: 'center' }}
                        onPress={()=>this.setState({ color: targetColor })}
                      >
                        <View style={{ 
                          height: color === targetColor ? 30 : 15,
                          width: color === targetColor ? 30 : 15,
                          backgroundColor: targetColor, borderRadius: 50 }}></View>
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
            !user_id ? null : <View style={{flex: 1, margin: 20}}>
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
