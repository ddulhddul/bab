import * as React from 'react';
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import SqlUtil from '../SqlUtil.js'

export default class SettingScreen extends React.Component {
  
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render () {
    const { } = this.state
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20, marginTop: 20, marginLeft: 30, marginRight: 30 }}>
            <Text style={{ fontSize: 30 }}>세팅</Text>
          </View>
          <View style={styles.unit}>
            <View style={styles.titleArea}>
              <Text style={{ fontSize: 20 }}>대상자 관리</Text>
            </View>
            <View style={styles.inputArea}>
              <Button
                onPress={() => 
                  this.props.navigation.navigate('AddBabModal', {})
                }
                title="설정"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

SettingScreen.navigationOptions = {
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
    flex: 7
  },
  inputArea: {
    flex: 3,
    // alignItems: 'center',
    // alignSelf: 'center',
    // alignContent: 'center',
  },
});
