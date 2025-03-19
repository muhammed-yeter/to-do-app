import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import React, { useContext } from 'react';
import themeContext from '../theme/themeContext';
import { useRouter } from 'expo-router';

import { Shadow } from 'react-native-shadow-2';

const SoonMenuItem = ({ taskName, taskDescription, taskTime, taskPriority, isEditable, taskDate, taskIndex }) => {
  const theme = useContext(themeContext);
  const router = useRouter();

  // Öncelikler ve başlıklar
  const taskSettings = {
    routine: { color: '#77C260', header: 'Günlük Rutin' },
    primary: { color: '#C26061', header: 'Öncelikli' },
    important: { color: '#F0B179', header: 'Önemli ' },
  };

  const { color: activeColor, header: activeHeader } = taskSettings[taskPriority] || { color: '#ccc', header: 'Bilinmeyen' };
  const DynamicMenuItem = isEditable ? View : TouchableOpacity;

  // Metni kısaltma işlemi
  const longTextDetector = (text, maxLength) => (text.length > maxLength ? `${text.substring(0, maxLength)}...` : text);

  const handleEditPage = () => {
    if (!taskDate || taskIndex === undefined) {
      console.error("Düzenleme işlemi için 'taskDate' ve 'taskIndex' gerekli.");
      return;
    }
    router.push({
      pathname: 'tasks/edit',
      params: { date: taskDate, index: taskIndex },
    });
  };

  return (
    <Shadow
      distance={5}
      startColor="#00005520"
      endColor="#00005501"
      offset={[0, 5]}
      style={{ width: "100%" }}
    >
      <DynamicMenuItem style={[styles.soonMenuItem, { backgroundColor: theme.bgColor1.backgroundColor }]}>
        <View style={[styles.round, { borderColor: theme.soonMenuItemRound?.borderColor || '#ccc' }]}></View>
        <View style={styles.details}>
          <Text style={[styles.fontHandler, styles.taskHeader, { color: theme.primaryText.color }]}>
            {[longTextDetector(taskName || 'İsimsiz Görev', 15), "  |  ", taskTime]}
          </Text>
          <Text style={[styles.fontHandler, styles.taskDesc, { color: theme.secondaryText.color }]}>
            {longTextDetector(taskDescription || 'Açıklama Yok', 32)}
          </Text>
        </View>
        <View style={styles.priorityContainer}>
          {isEditable && (
            <TouchableOpacity
              style={[styles.edit, { backgroundColor: theme.interactItem?.backgroundColor || '#6255D3' }]}
              onPress={handleEditPage}
            >
              <FontAwesome5 name="pencil-alt" size={18} color="#fff" />
            </TouchableOpacity>
          )}
          <View style={[styles.priority, { backgroundColor: activeColor }]}>
            <Text style={[styles.fontHandler, { color: theme.primaryText.color }]}>{activeHeader}</Text>
          </View>
        </View>
      </DynamicMenuItem>
    </Shadow>
  );
};

const styles = StyleSheet.create({
  soonMenuItem: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: wp('4'),
    paddingVertical: hp('2'),
    borderRadius: 7,
    gap: wp('4'),
  },
  round: {
    height: 10,
    borderRadius: '50%',
    padding: 5,
    borderWidth: 1,
  },
  taskHeader: {
    fontSize: wp("4.5"),
  },
  taskDesc: {
    fontSize: wp("3.5"),
  },
  fontHandler: {
    fontSize: wp("4"),
  },
  details: {
    gap: hp('1.5'),
  },
  priorityContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 10,
  },
  priority: {
    paddingVertical: hp("1"),
    paddingHorizontal: wp("2"),
    borderRadius: 5,
    width: wp("23.5"),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  edit: {
    paddingVertical: hp("1"),
    paddingHorizontal: wp("10"),
    borderRadius: 5,
  },
});

export default SoonMenuItem;
