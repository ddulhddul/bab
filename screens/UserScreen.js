import * as React from 'react';
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import SqlUtil from '../SqlUtil.js'
import { AdMobBanner } from 'expo-ads-admob';
import Private from './Private.json';

export default class UserScreen extends React.Component {
  
  constructor (props) {
    super(props)
    this.state = {
      userList: []
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.initUserList()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  async initUserList () {
    let list = await SqlUtil.listUser() || []
    this.setState({ userList: list })
  }

  callModal (param) {
    this.props.navigation.navigate('AddUserModal', { ...param, title: !param? 'Add': 'Modify' })
  }

  render () {
    const { userList } = this.state
    return (
      <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <AdMobBanner
            bannerSize="banner"
            adUnitID={Private.admobId}
            setTestDeviceID="EMULATOR"
            servePersonalizedAds // true or false
            onDidFailToReceiveAdWithError={()=>{console.log('bannerError')}}
          />
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20, marginTop: 0, marginLeft: 30, marginRight: 30 }}>
            <Text style={{ fontSize: 30 }}>대상자</Text>
          </View>
          {
            (!userList || !userList.length)
            ? <View style={styles.unit}>
              <Text style={{ fontSize: 20, color: 'grey' }}>대상자를 추가해주세요.</Text>
            </View> :
            userList.map((user) => {
              return (
                <TouchableOpacity onPress={()=>this.callModal(user)} key={user.user_id}>
                  <View style={[ styles.unit, { justifyContent: 'center', alignItems: 'center' } ]}>
                    <View style={[ styles.titleArea, { alignItems: 'flex-end' } ]}>
                      <View style={{ height: 15, width: 15, backgroundColor: user.color, borderRadius: 50, marginRight: 10 }} />
                    </View>
                    <View style={styles.inputArea}>
                      <Text style={{ fontSize: 20 }}>{ user.name }</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          }
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

UserScreen.navigationOptions = {
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
  unit: {
    // justifyContent: 'center',
    flexDirection: 'row',
    margin: 15,
    marginTop: 30
  },
  titleArea: {
    flex: 1
  },
  inputArea: {
    flex: 9,
    // alignItems: 'center',
    // alignSelf: 'center',
    // alignContent: 'center',
  },
});
