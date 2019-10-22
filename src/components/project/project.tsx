import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import Animated, { Easing } from "react-native-reanimated";

const {
  Clock,
  cond,
  startClock,
  stopClock,
  Value,
  block,
  concat,
  clockRunning,
  timing,
  set
} = Animated;

class Project extends Component {
  constructor(props) {
    super(props);

    const state = {
      finished: new Value(0),
      frameTime: new Value(0),
      position: new Value(0),
      time: new Value(0)
    };

    this.toValue = new Value();
    const clock = new Clock();
    this.rotation = block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.frameTime, 0),
        set(state.time, 0),
        startClock(clock)
      ]),
      timing(clock, state, {
        duration: 200,
        easing: Easing.linear,
        toValue: this.toValue
      }),
      cond(state.finished, stopClock(clock)),
      state.position
    ]);
  }

  componentDidUpdate(prevProps): void {
    if (prevProps.rotated !== this.props.rotated) {
      this.toValue.setValue(this.props.rotated ? 180 : 0);
    }
  }

  handleOnPress = () => this.props.onPress(this.props.id);

  render() {
    const { color, title, total, completed, rotated } = this.props;
    return (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: color,
            transform: [
              {
                rotateY: concat(this.rotation, "deg")
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center"
          }}
          onPress={this.handleOnPress}
        >
          {!rotated ? (
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text
                style={styles.subtitle}
              >{`${completed} / ${total} Completed`}</Text>
            </View>
          ) : (
            <Animated.View style={{ transform: [{ rotateY: "180deg" }] }}>
              <Text style={[styles.text]}>Todo 1</Text>
              <Text>Todo 2</Text>
              <Text>Todo 3</Text>
              <Text>Todo 4</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minWidth: 200,
    minHeight: 200,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  text: {
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "bold"
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 14,
    color: "#D8DADE"
  }
});

export default Project;
