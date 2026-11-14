import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    Easing,
} from 'react-native-reanimated';

interface TabIconProps {
    focused: boolean;
    icon: string;
    activeIcon: string;
    badge?: boolean;
    color: string;
    activeColor: string;
}

export default function AnimatedTabIcon({
    focused,
    icon,
    activeIcon,
    badge,
    color,
    activeColor,
}: Readonly<TabIconProps>) {
    const scale = useSharedValue(1);
    const dotOpacity = useSharedValue(focused ? 1 : 0);
    const dotScale = useSharedValue(focused ? 1 : 0);

    useEffect(() => {
        const ease = { duration: 200, easing: Easing.out(Easing.cubic) };
        if (focused) {
            scale.value = withSequence(
                withTiming(1.15, { duration: 100, easing: Easing.out(Easing.quad) }),
                withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) }),
            );
            dotOpacity.value = withTiming(1, ease);
            dotScale.value = withTiming(1, ease);
        } else {
            scale.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) });
            dotOpacity.value = withTiming(0, { duration: 150, easing: Easing.out(Easing.quad) });
            dotScale.value = withTiming(0, { duration: 150, easing: Easing.out(Easing.quad) });
        }
    }, [focused]);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const dotStyle = useAnimatedStyle(() => ({
        opacity: dotOpacity.value,
        transform: [{ scale: dotScale.value }],
    }));

    return (
        <View style={styles.iconWrap}>
            <Animated.View style={iconStyle}>
                <Ionicons
                    name={(focused ? activeIcon : icon) as any}
                    size={22}
                    color={color}
                />
            </Animated.View>
            <Animated.View style={[styles.activeDot, dotStyle, { backgroundColor: activeColor }]} />
            {badge && !focused && <View style={[styles.badgeDot, { borderColor: 'transparent' }]} />}
        </View>
    );
}

const styles = StyleSheet.create({
    iconWrap: {
        width: 44,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    badgeDot: {
        position: 'absolute',
        top: 0,
        right: 4,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#f43f5e',
        borderWidth: 1,
    },
});