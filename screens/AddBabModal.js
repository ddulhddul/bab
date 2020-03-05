import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function AddBabModal({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView style={{...styles.container, flex: 1}} contentContainerStyle={styles.contentContainer}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      </ScrollView>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
});
