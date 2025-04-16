import { View, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { PlatformPressable } from '@react-navigation/elements';
import { useRouter } from 'expo-router';

import React, { useContext } from 'react';
import themeContext from '../theme/themeContext';

export default function Header() {
  const theme = useContext(themeContext);
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Ionicons name="water-outline" size={40} color={theme.primaryText.color} />
        <Text style={[styles.headerText, { color: theme.primaryText.color }]}>SampleIcon</Text>
      </View>
      <View>
        <PlatformPressable
          onPress={() => router.push("/settings")}
          style={styles.getBack}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
          <FontAwesome5 name="cog" size={30} color={theme.primaryText.color} />
        </PlatformPressable>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Regular',
    fontSize: 22,
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
