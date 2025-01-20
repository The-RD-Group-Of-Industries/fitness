import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';

export default function TabTwoScreen() {
    const color = useThemeColor({ light: "black", dark: "white" }, 'text');

    const options = [
      {
        title: "Settings",
        Icon: Feather,
        iconName: "settings",
        iconColor: "deepskyblue",
      },
      {
        title: "Workout History",
        Icon: Fontisto,
        iconName: "history",
        iconColor: "purple",
      },
      {
        title: "Achivements",
        Icon: Entypo,
        iconName: "medal",
        iconColor: "gold",
      },
      {
        title: "Help & Support",
        Icon: Entypo,
        iconName: "help-with-circle",
        iconColor: "green",
      },
    ]
  return (
    <View style={styles.container}>
      <View style={styles.child}>
      <Text style={[styles.heading,  { color }]}>My Account</Text>
      
      <View style={styles.cardPrimary}>
      <LinearGradient
        colors={['#704CC5', '#465EC2']}
        style={styles.modCircle}
        start={{x: 0.3, y: 1}}
        end={{y: 0, x: 0.3}}
        >
        <Text style={styles.text}>
          <Ionicons name="person" size={38} color={color} />
        </Text>
      </LinearGradient>
        <View style={styles.boxText}> 
            <Text style={styles.name}>Joe Due</Text>
            <Text style={styles.email}>joe.example@example.com</Text>
        </View>
      </View>

    {
      options.map((items, index) => (
        <TouchableOpacity key={index} style={styles.smallCard}>
    <View style={styles.content}>
    <items.Icon name={`${items.iconName}`} size={24} color={`${items.iconColor}`} />
    <Text style={[styles.text, {color}]}>{items.title}</Text>
    </View>
    <Feather name="arrow-right-circle" size={24} color="#f2f2f2" />
    </TouchableOpacity>
    ))
  }


      </View>
    </View>
  );
}


const primary = "#090E21";

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%',
  },
  child: {
    paddingHorizontal: 10,
    gap: 10
  },
  heading: {
    fontSize: 38,
    fontWeight: "800",
    marginBottom: '2%'
  }, 
  cardPrimary: {
    width: '80%',
    height: 160,
    backgroundColor: primary,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '4%'
  },
  modCircle: {
    width: 100,
    height: 100,
    backgroundColor: 'purple',
    borderRadius: 250,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: '600'
  },
  boxText: {
    width: '80%',
    height: 'auto',
  },
  name: {
    color: 'white',
    fontWeight: '700',
    fontSize: 30
  },
  email: {
    color: 'gray',
    fontWeight: '400',
    fontSize: 15
  },

  smallCard: {
    width: 'auto',
    backgroundColor: primary,
    borderRadius: 14,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: '6%',
  }, 
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12
  }
})