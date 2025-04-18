import { View, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const LoadingScreen = ({ visible, isOverlay }) => {
    return (
        isOverlay == true ?
            <Modal
                transparent={true}
                animationType="fade"
                visible={visible}
            >
                <View style={styles.overlay}>
                    <LottieView
                        source={require('../assets/animations/loadingAnimation.json')}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                </View>
            </Modal> : <View style={styles.container}>
                <LottieView
                    source={require('../assets/animations/loadingAnimation.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f2f1fa",
    },
    overlay: {
        width: wp("100"),
        height: hp("100"),
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)', 
    },
    animation: {
        width: 200,
        height: 200,
        alignSelf: 'center', 
    },

});

export default LoadingScreen;
