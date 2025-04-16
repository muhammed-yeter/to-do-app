import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useRouter } from 'expo-router';

import React, { useContext, useState } from 'react';
import themeContext from '../theme/themeContext';

import { Shadow } from 'react-native-shadow-2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './LoadingScreen';

import { deleteAllNotifications } from '../scripts/notificationSystem';

export default function SettingsMenuItem({ header, icon, dataController, locateTo }) {
  const theme = useContext(themeContext);
  var IconComponent = "";

  if (Octicons.getRawGlyphMap()[icon]) {
    IconComponent = Octicons;
  }
  else if (FontAwesome5.getRawGlyphMap()[icon]) {
    IconComponent = FontAwesome5;
  }
  else {
    IconComponent = MaterialIcons;
  }
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  return (
    <View>
      <LoadingScreen visible={isLoading} isOverlay={true} />
      <Shadow
        distance={5}
        startColor="#00005520"
        endColor="#00005501"
        offset={[0, 5]}
        style={{ width: "100%" }}
      >
        <TouchableOpacity style={[styles.settingsMenuItem, { backgroundColor: theme.bgColor1.backgroundColor }]}
          onPress={() => {
            if (dataController) {
              Alert.alert(
                "Uyarı !",
                "Bu işlem tüm görev verilerinizi silecektir. Onaylıyor musunuz?",
                [
                  // The "Yes" button
                  {
                    text: "Evet",
                    onPress: () => {
                      setIsLoading(true);
                      deleteAllNotifications();
                      AsyncStorage.clear();
                      setIsLoading(false);
                      router.push({ pathname: locateTo, params: { taskObject: JSON.stringify("") } });
                    },
                  },
                  // The "No" button
                  // Does nothing but dismiss the dialog when tapped
                  {
                    text: "Hayır",
                  },
                ]
              );
            }
            else { router.push(locateTo) }
          }}>
          <IconComponent name={icon} size={30} color={theme.primaryText.color} />
          <Text style={{ color: theme.primaryText.color, paddingVertical: 5, fontSize: wp("4") }}>{header}</Text>
        </TouchableOpacity>
      </Shadow>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsMenuItem: {
    borderRadius: 7,
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('2%'),
    display: "flex",
    flexDirection: "row",
    gap: wp('3%'),
  }
});