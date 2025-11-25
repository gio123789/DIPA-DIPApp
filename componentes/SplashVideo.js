import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';

const SplashVideo = ({ onFinish }) => {
  const video = useRef(null);
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require('../assets/videos/Libro Dipa FB.mp4')}
        style={{ width, height }}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={status => {
          if (status.didJustFinish && onFinish) {
            onFinish();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashVideo;
