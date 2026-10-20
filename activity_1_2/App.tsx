import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Practical Activities
      </Text>

      {/* Welcome Message */}
      <View style={styles.section}>
        <Text style={styles.welcome}>
          Welcome to the React Native Application, Prem
        </Text>
      </View>

      {/* Login */}
      <View style={styles.section}>
        <Text style={styles.heading}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Email"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>

      {/* Student Card */}
      <View style={styles.card}>
        <Image
          source={{uri: 'https://picsum.photos/100'}}
          style={styles.image}
        />

        <View>
          <Text style={styles.studentName}>
            Prem
          </Text>

          <Text>Roll No: 101</Text>
          <Text>Department: AI & ML</Text>
        </View>
      </View>

      {/* Counter */}
      <View style={styles.counter}>
        <Text style={styles.heading}>Counter</Text>

        <Text style={styles.count}>
          {count}
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => setCount(count - 1)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => setCount(count + 1)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 15,
  },

  section: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  welcome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#16A34A',
    textAlign: 'center',
  },

  heading: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },

  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  counter: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  count: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    gap: 15,
  },

  smallButton: {
    backgroundColor: '#2563EB',
    width: 55,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});