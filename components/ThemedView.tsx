import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

export function ThemedView({children, style}: {
  children: React.ReactNode,
  style?: any
}) {
  const background = "#090E21";
  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: background, ...style}]} edges={['top']}>
      {children}
    </SafeAreaView>
  )
}