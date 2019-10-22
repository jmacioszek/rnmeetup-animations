import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CheckBox } from "react-native-elements";

import { runLinearTiming } from "../../utils";

const { Value, Clock } = Animated;

class Task extends Component {
  constructor(props) {
    super(props);

    const clock = new Clock();
    this.toValue = new Value(1);
    this.opacity = runLinearTiming({
      clock: clock,
      toValue: this.toValue,
      position: new Value(1)
    });


  }

  componentDidUpdate(prevProps): void {
    if (this.props.checked !== prevProps.checked) {
      this.toValue.setValue(this.props.checked ? 0.2 : 1);
    }
  }

  handleOnPress = () => this.props.onPress(this.props.id);

  render() {
    return (
      <Animated.View
        style={{
          opacity: this.opacity
        }}
      >
        <TouchableOpacity
          onPress={this.handleOnPress}
          activeOpacity={1}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text style={styles.text}>{this.props.text}</Text>
          <CheckBox checked={this.props.checked} checkedColor="green" />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: "#D8DADE",
    fontSize: 16,
    fontWeight: "500"
  }
});

export default Task;
