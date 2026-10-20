import React from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';

const fruits = [
  'Apple',
  'Banana',
  'Mango',
  'Orange',
  'Grapes',
  'Watermelon',
  'Pineapple',
  'Papaya',
];

export default function App() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Activity 3
      </Text>

      {/* Fruit List */}
      <Text style={styles.heading}>
        Fruit List
      </Text>

      <FlatList
        data={fruits}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.fruitCard}>
            <Text style={styles.fruit}>
              🍎 {item}
            </Text>
          </View>
        )}
      />

      {/* About College */}
      <Text style={styles.heading}>
        About Our College
      </Text>

      <ScrollView style={styles.about}>

        <Text style={styles.paragraph}>
          Our college provides a good environment for learning.
        </Text>

        <Text style={styles.paragraph}>
          The college offers various technical courses.
        </Text>

        <Text style={styles.paragraph}>
          Experienced teachers guide students in their studies.
        </Text>

        <Text style={styles.paragraph}>
          The college has modern classrooms and laboratories.
        </Text>

        <Text style={styles.paragraph}>
          Students participate in technical events and competitions.
        </Text>

        <Text style={styles.paragraph}>
          Workshops and seminars improve practical knowledge.
        </Text>

        <Text style={styles.paragraph}>
          Sports and cultural activities encourage teamwork.
        </Text>

        <Text style={styles.paragraph}>
          Student clubs provide opportunities to learn new skills.
        </Text>

        <Text style={styles.paragraph}>
          The college supports students in career development.
        </Text>

        <Text style={styles.paragraph}>
          Overall, the college helps students grow academically
          and professionally.
        </Text>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 15,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },

  fruitCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },

  fruit: {
    fontSize: 16,
    color: '#2563EB',
  },

  about: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
  },

  paragraph: {
    fontSize: 15,
    lineHeight: 23,
    color: '#475569',
    marginBottom: 12,
  },
});