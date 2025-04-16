import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import React, { useContext, useEffect } from 'react';
import themeContext from '../theme/themeContext';
import { useRouter } from 'expo-router';

import { Shadow } from 'react-native-shadow-2';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const SoonMenuItem = ({ taskName, taskDescription, taskTime, taskPriority, isEditable, taskDate, taskIndex, isEnabled, task }) => {
  const theme = useContext(themeContext);
  const router = useRouter();

  // Öncelikler ve başlıklar
  const taskSettings = {
    routine: { color: theme.priorityColors.routine.backgroundColor, header: 'Günlük Rutin' },
    primary: { color: theme.priorityColors.primary.backgroundColor, header: 'Öncelikli' },
    important: { color: theme.priorityColors.important.backgroundColor, header: 'Önemli ' },
  };

  const {
    color: activeColor, header: activeHeader } = taskSettings[taskPriority] || { color: '#ccc', header: 'Bilinmeyen' };
  const DynamicMenuItem = isEditable ? View : TouchableOpacity;
  const DynamicIcon = isEnabled ? FontAwesome5 : MaterialIcons;

  const longTextDetector = (text, maxLength) => (text.length > maxLength ? `${text.substring(0, maxLength)}...` : text);

  const editPageHandler = () => {
    router.push({
      pathname: isEnabled ? "tasks/edit" : "tasks/view",
      params: { index: taskIndex, date: taskDate, taskObject: JSON.stringify(task) }
    });
  };

  return (
    <Shadow
      distance={5}
      startColor={isEnabled ? "#00005520" : "#00005500"}
      endColor={isEnabled ? "#00005501" : "#00005500"}
      offset={[0, 5]}
      style={{
        width: "100%", borderRadius: 10,
      }}
    >
      <DynamicMenuItem style={[styles.soonMenuItem, { backgroundColor: theme.bgColor1.backgroundColor }]} onPress={
        () => {
          router.push({
            pathname: "tasks/view",
            params: { index: taskIndex, date: taskDate, taskObject: JSON.stringify(task) }
          })
        }
      }>
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
          {isEditable && ((<TouchableOpacity
            style={[styles.edit, { zIndex: isEnabled ? 0 : 2, backgroundColor: theme.interactItem?.backgroundColor }]}
            onPress={editPageHandler}
          >
            <DynamicIcon name={isEnabled ? "pencil-alt" : "read-more"} size={18} color="#fff" />
          </TouchableOpacity>)
          )}
          <View style={[styles.priority, { backgroundColor: activeColor }]}>
            <Text style={[styles.fontHandler, {
              color:
                taskPriority === "routine"
                  ? theme.priorityColors.routine.textColor
                  : taskPriority === "important"
                    ? theme.priorityColors.important.textColor
                    : theme.priorityColors.primary.textColor
            }
            ]}>{activeHeader}</Text>
          </View>
        </View>
      </DynamicMenuItem>
      {
        !isEnabled && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject, // position: absolute | top,left,right,bottom : 0 demekle aynı şey
              backgroundColor: theme.bgColor4.backgroundColor,
              borderRadius: 10,
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <MaterialIcons name="alarm-on" size={70} color="#1ABC9C80" />
          </View>
        )
      }
    </Shadow >

  );
};

const styles = StyleSheet.create({
  soonMenuItem: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: wp('4'),
    paddingVertical: hp('2'),
    borderRadius: 10,
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
  info: {
    paddingVertical: hp(".1"),
    paddingHorizontal: wp("2"),
    borderRadius: 5,
  },
});

export default SoonMenuItem;
