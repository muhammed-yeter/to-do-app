import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import themeContext from '../theme/themeContext';

export default function RadioButton({ priority, onSelect, isSelected }) {
    const theme = useContext(themeContext);
    const colors = {
        routine: theme.priorityColors.routine.backgroundColor,
        primary: theme.priorityColors.primary.backgroundColor,
        important: theme.priorityColors.important.backgroundColor,
    };

    const headers = {
        routine: 'Günlük Rutin',
        primary: 'Öncelikli',
        important: 'Önemli',
    };

    const activeColor = colors[priority];
    const activeHeader = headers[priority];

    return (
        <View style={styles.radioButton}>
            <View
                style={[
                    styles.round,
                    { backgroundColor: isSelected ? theme.soonMenuItemRound.borderColor : "transparent" },
                    { borderColor: theme.soonMenuItemRound.borderColor }
                ]}
            />
            <TouchableOpacity
                onPress={() => onSelect(priority)}
                style={[styles.priority, { backgroundColor: activeColor }]}>
                <Text style={[styles.fontHandler, {
                    color:
                        activeHeader === "Günlük Rutin"
                            ? theme.priorityColors.routine.textColor
                            : activeHeader === "Önemli"
                                ? theme.priorityColors.important.textColor
                                : theme.priorityColors.primary.textColor
                }
                ]}>{activeHeader}</Text>
            </TouchableOpacity>
        </View>
    );
}



const styles = StyleSheet.create({
    radioButton: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: wp('4'),
    },

    round: {
        height: 10,
        borderRadius: '50%',
        padding: 5,
        borderWidth: 1,
    },

    taskHeader: {
        fontSize: wp("5"),
    },

    taskDesc: {
        fontSize: wp("4"),
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
        width: wp("35"),
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
