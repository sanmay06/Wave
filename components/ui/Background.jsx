import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function RadialBackground() {
  // return (
    // <View style={{...StyleSheet.absoluteFill, zIndex: -1}} pointerEvents="none">
    //   <Svg
    //     width={width}
    //     height={height}
    //     style={{ transform: [{ rotate: '180deg' }] }}
    //   >
    //     <Defs>
    //       <RadialGradient
    //         id="grad"
    //         cx="50%"
    //         cy="50%"
    //         rx="60%"
    //         ry="120%"
    //         fx="50%"
    //         fy="50%"
    //       >
    //         <Stop offset="0%" stopColor="white" stopOpacity="0" />
    //         <Stop offset="100%" stopColor="rgba(252,205,238,0.5)" />
    //       </RadialGradient>
    //     </Defs>
    //     <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
    //   </Svg>
    // </View>
  // );

  return (
    <View style = {{...StyleSheet.absoluteFillObject, zIndex: -1, backgroundColor: 'rgba(252,205,238,0.5)'}} pointerEvents="none">

    </View>
  );
}


