import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React from 'react'
import { useThemeColor } from '@/hooks/useThemeColor';

export default function Trainer() {
  const color = useThemeColor({ light: "black", dark: "white" }, 'text');

  const option = [
    {
        name: "Salman Khan",
        imageLink: "https://reactnative.dev/img/tiny_logo.png",
    },
    {
        name: "Adarsh Pandit",
        imageLink: "https://reactnative.dev/img/tiny_logo.png",
    },
    {
        name: "Rekha Ji",
        imageLink: "https://reactnative.dev/img/tiny_logo.png",
    },
  ]
  return (
    <View style={style.main}>
      <Text style={[style.heading, {color}]}>Featured Trainer</Text>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flex: 1}}>
        {
            option.length > 0 && option.map((items, idx) => (
                <View style={style.box} key={idx}>
                <View style={style.image}>
                    <Image 
                    alt='avatar'
                    source={{uri: `${items.imageLink}`}}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    width={1080}
                    height={1080}
                    />
                </View>
                <Text style={style.title}>{items.name}</Text>
            </View>
    
            ))
        }
    </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
    main: {
        paddingHorizontal: 12,
    },
    heading: {
        fontSize: 28,
        fontWeight: '800',
        paddingVertical: 10,
    },
    box: {
        width: 200,
        height: 200,
        marginLeft: 10,
    },
    image: {
        width: '100%',
        height: '85%',
        // backgroundColor: 'blue',
        borderRadius: 14,
        overflow: 'hidden'
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: '800',
        marginTop: 2,
    },
    subHeading: {
        fontSize: 16,
        color: 'red'
    }
})