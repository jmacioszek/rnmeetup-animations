import React, { Component } from "react";

import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

const { Value, cond, eq, set, call, event } = Animated;

class DragHandler extends Component {
  translationX = new Value(0);
  translationY = new Value(0);
  absoluteX = new Value(0);
  absoluteY = new Value(0);
  dragState = new Value(0);
  isDragging = new Value(0);

  handleProjectGesture = event([
    {
      nativeEvent: {
        translationX: this.translationX,
        translationY: this.translationY,
        absoluteY: this.absoluteY,
        absoluteX: this.absoluteX,
        state: this.dragState
      }
    }
  ]);

  handleDragEnd = ([x, y]) => {
    this.props.onDragEnd(x, y, this.props.data);
    this.translationX.setValue(0);
    this.translationY.setValue(0);
  };

  render() {
    return (
      <>
        <Animated.Code>
          {() =>
            cond(
              eq(this.dragState, State.ACTIVE),
              cond(
                this.isDragging,
                call([this.absoluteX, this.absoluteY], this.props.onDrag),
                [set(this.isDragging, 1), call([], this.props.onDragStart)]
              ),
              [
                set(this.isDragging, 0),
                call([this.absoluteX, this.absoluteY], this.handleDragEnd)
              ]
            )
          }
        </Animated.Code>
        <PanGestureHandler
          onHandlerStateChange={this.handleProjectGesture}
          onGestureEvent={this.handleProjectGesture}
        >
          <Animated.View
            style={[
              {
                flexDirection: "row",
                transform: [
                  {
                    translateX: this.translationX
                  },
                  {
                    translateY: this.translationY
                  }
                ]
              }
            ]}
          >
            {this.props.children}
          </Animated.View>
        </PanGestureHandler>
      </>
    );
  }
}

export default DragHandler;
