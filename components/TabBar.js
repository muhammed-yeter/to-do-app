import React, { useContext } from 'react';
import { View } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Shadow } from 'react-native-shadow-2';

import themeContext from "../theme/themeContext";

const TabBar = ({ state, descriptors, navigation }) => {
    const theme = useContext(themeContext);
    const colors = {
        selected: "#6255D3",
        default: theme.primaryText.color,
        background: theme.bgColor2.backgroundColor,
    };
    const { buildHref } = useLinkBuilder();

    return (
        <Shadow
            distance={20}
            startColor="#00005517"
            endColor="#00005501"
            style={{ width: "100%" }}
        >
            <View style={{ flexDirection: 'row', backgroundColor: colors.background }}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const icon = options.icon || "question";

                    if (['_sitemap', 'settings', '+not-found', 'settings/theme', 'settings/report', 'tasks/create', 'tasks/edit', 'tasks/view'].includes(route.name)) return null;
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        // Yönlendirme
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    return (
                        <PlatformPressable
                            key={route.key}
                            href={buildHref(route.name, route.params)}
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarButtonTestID}
                            onPress={onPress}
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                gap: hp("0.75"),
                                padding: hp("2"),
                            }}
                        >
                            <FontAwesome5
                                style={{
                                    color: isFocused ? colors.selected : colors.default,
                                }}
                                name={icon}
                                size={26}
                                color={theme.primaryText.color}
                            />
                            <Text style={{
                                color: isFocused ? colors.selected : colors.default,
                                fontSize: wp("4"),
                            }}>
                                {label}
                            </Text>
                        </PlatformPressable>
                    );
                })}
            </View>
        </Shadow>
    );
};

export default TabBar;
