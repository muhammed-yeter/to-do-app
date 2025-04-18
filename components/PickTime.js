import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import themeContext from '../theme/themeContext';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const formatTime = v => v.toString().padStart(2, '0');

const PickTime = ({ defaultValue, onTimeChange }) => {
  const theme = useContext(themeContext);

  const [hour, setHour] = useState(() => {
    
    if (!defaultValue) {
      const now = new Date();
      return now.getHours();
    }
    
    return Number(defaultValue.split(':')[0]);
  });
  const [minute, setMinute] = useState(() => {
    if (!defaultValue) {
      const now = new Date();
      return now.getMinutes();
    }
    return Number(defaultValue.split(':')[1]);
  });

  
  useEffect(() => {
    if (defaultValue) {
      const [h, m] = defaultValue.split(':').map(Number);
      setHour(h);
      setMinute(m);
    }
    
    
  }, [defaultValue]);

  
  const incHour = () => {
    setHour(h => {
      const nh = (h + 1) % 24;
      onTimeChange(`${formatTime(nh)}:${formatTime(minute)}`);
      return nh;
    });
  };
  const decHour = () => {
    setHour(h => {
      const nh = (h + 23) % 24;
      onTimeChange(`${formatTime(nh)}:${formatTime(minute)}`);
      return nh;
    });
  };
  const incMin = () => {
    setMinute(m => {
      const nm = (m + 1) % 60;
      onTimeChange(`${formatTime(hour)}:${formatTime(nm)}`);
      return nm;
    });
  };
  const decMin = () => {
    setMinute(m => {
      const nm = (m + 59) % 60;
      onTimeChange(`${formatTime(hour)}:${formatTime(nm)}`);
      return nm;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.setter}>
        <TouchableOpacity onPress={decHour} hitSlop={styles.hitSlop}>
          <FontAwesome5 name="angle-left" size={36} color="#6255D3" />
        </TouchableOpacity>
        <Text style={[styles.time, {
          backgroundColor: theme.bgColor2.backgroundColor,
          color: theme.primaryText.color,
        }]}>
          {formatTime(hour)}
        </Text>
        <TouchableOpacity onPress={incHour} hitSlop={styles.hitSlop}>
          <FontAwesome5 name="angle-right" size={36} color="#6255D3" />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 36, color: theme.primaryText.color }}>:</Text>

      <View style={styles.setter}>
        <TouchableOpacity onPress={decMin} hitSlop={styles.hitSlop}>
          <FontAwesome5 name="angle-left" size={36} color="#6255D3" />
        </TouchableOpacity>
        <Text style={[styles.time, {
          backgroundColor: theme.bgColor2.backgroundColor,
          color: theme.primaryText.color,
        }]}>
          {formatTime(minute)}
        </Text>
        <TouchableOpacity onPress={incMin} hitSlop={styles.hitSlop}>
          <FontAwesome5 name="angle-right" size={36} color="#6255D3" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('5%'),
  },
  setter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  time: {
    fontSize: 36,
    borderRadius: 10,
    padding: wp('2%'),
  },
  hitSlop: {
    top: 30, bottom: 30, left: 30, right: 30,
  },
});

export default PickTime;
