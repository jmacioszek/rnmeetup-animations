import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  LayoutAnimation,
  Image,
  UIManager,
  Platform
} from "react-native";

import Project from "../../components/project/";
import Task from "../../components/task/";
import { state } from "../../state";

import Animated from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import FlameLoader from "../../flame-loader.json";
import logo from "../../logo.png";

import DragHandler from "../../dragHandler";

const { event, Value, interpolate, Extrapolate } = Animated;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

class Dashboard extends Component {
  deleteArea = {
    y: 0,
    width: 0,
    height: 0
  };

  projectArea = {
    width: 0,
    height: 0
  };

  scrollY = new Value(1);
  headerScale = interpolate(this.scrollY, {
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
  });
  headerTranslateY = interpolate(this.scrollY, {
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: Extrapolate.CLAMP
  });

  constructor(props) {
    super(props);

    this.state = {
      showDelete: false,
      isInDeleteArea: false,
      showLottie: true,
      ...state
    };
  }

  componentDidMount(): void {
    setTimeout(() => {
      this.setState({
        showLottie: false
      });
    }, 2400);
  }

  handleProjectPress = id => {
    const index = this.state.projects.findIndex(project => project.id === id);
    const projectsCopy = [...this.state.projects];
    const project = projectsCopy[index];
    projectsCopy[index] = {
      ...projectsCopy[index],
      rotated: !project.rotated
    };
    this.setState({
      projects: [...projectsCopy]
    });
  };

  handleTaskPress = id => {
    const index = this.state.tasks.findIndex(task => task.id === id);
    const tasksCopy = [...this.state.tasks];
    const task = tasksCopy[index];
    tasksCopy[index] = {
      ...tasksCopy[index],
      done: !task.done
    };
    this.setState({
      tasks: [...tasksCopy]
    });
  };

  handleDeleteProject = id => {
    const index = this.state.projects.findIndex(project => project.id === id);
    const projectsCopy = [...this.state.projects];
    projectsCopy.splice(index, 1);
    this.setState({
      projects: [...projectsCopy]
    });
  };

  isInDeleteArea = y => {
    if (y >= this.deleteArea.y - this.deleteArea.height) {
      return true;
    }

    return false;
  };

  handleDeleteOnLayout = ({
    nativeEvent: {
      layout: { x, y, width, height }
    }
  }) => {
    this.deleteArea = {
      y,
      width,
      height
    };
  };

  handleProjectOnLayout = ({
    nativeEvent: {
      layout: { width, height }
    }
  }) => {
    this.projectArea = {
      width,
      height
    };
  };

  showDelete = ([]) => {
    LayoutAnimation.configureNext({
      duration: 700,
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.5
      }
    });
    this.setState({
      showDelete: true
    });
  };

  hideDelete = (x, y, data) => {
    LayoutAnimation.configureNext({
      duration: 700,
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.5
      }
    });

    if (this.isInDeleteArea(y)) {
      this.handleDeleteProject(data.id);
    }
    this.setState({
      showDelete: false
    });
  };

  handleProjectDrag = ([absoluteX, absoluteY]) => {
    if (this.isInDeleteArea(absoluteY) && !this.state.isInDeleteArea) {
      this.setState({
        isInDeleteArea: true
      });
    } else if (!this.isInDeleteArea(absoluteY) && this.state.isInDeleteArea) {
      this.setState({
        isInDeleteArea: false
      });
    }
  };

  handleScroll = event([
    {
      nativeEvent: {
        contentOffset: {
          y: this.scrollY
        }
      }
    }
  ]);

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { overflow: "hidden" }]}>
          <Text style={[styles.text, styles.dashboard]}>Dashboard</Text>
          {this.state.showLottie && (
            <LottieView
              source={FlameLoader}
              autoPlay={true}
              loop={true}
              style={{
                zIndex: 999,
                backgroundColor: "rgba(0,0,0, 0.4)"
              }}
            />
          )}
          <Animated.View
            style={[
              styles.imageContainer,
              {
                opacity: this.headerScale,
                transform: [
                  {
                    translateY: this.headerTranslateY
                  },
                  {
                    scale: this.headerScale
                  }
                ]
              }
            ]}
          >
            <Image
              source={logo}
              style={{
                height: 80,
                width: 80
              }}
            />
          </Animated.View>
          <AnimatedScrollView
            scrollEventThrottle={16}
            onScroll={this.handleScroll}
          >
            <View style={{ height: 60 }}></View>
            <View style={styles.projectsContainer}>
              <Text style={[styles.text, styles.header]}>Projects</Text>
              <ScrollView
                horizontal={true}
                style={{
                  overflow: "visible"
                }}
              >
                {this.state.projects.map(project => (
                  <DragHandler
                    key={project.id}
                    onDragStart={this.showDelete}
                    onDragEnd={this.hideDelete}
                    onDrag={this.handleProjectDrag}
                    data={{
                      id: project.id
                    }}
                  >
                    <Animated.View
                      onLayout={this.handleProjectOnLayout}
                      style={styles.projectContainer}
                    >
                      <Project
                        id={project.id}
                        onPress={this.handleProjectPress}
                        color={project.color}
                        title={project.title}
                        total={project.total}
                        completed={project.completed}
                        rotated={project.rotated}
                      />
                    </Animated.View>
                  </DragHandler>
                ))}
              </ScrollView>
            </View>
            <Text style={[styles.text, styles.header]}>Today tasks</Text>
            {this.state.tasks.map(task => (
              <Task
                id={task.id}
                onPress={this.handleTaskPress}
                key={task.id}
                checked={task.done}
                text={task.text}
              />
            ))}
          </AnimatedScrollView>
        </View>
        <View
          onLayout={this.handleDeleteOnLayout}
          style={[
            styles.deleteContainer,
            {
              backgroundColor: this.state.isInDeleteArea ? "red" : "#666666"
            }
          ]}
        >
          {this.state.showDelete && (
            <View style={{ paddingTop: 20, paddingBottom: 30 }}>
              <Icon name="trash" size={30} color="#fff" />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#060606",
    flex: 1
  },
  container: {
    paddingHorizontal: 30,
    backgroundColor: "#060606",
    flex: 1
  },
  text: {
    color: "#D8DADE"
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  dashboard: {
    fontSize: 26,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20
  },
  projectContainer: {
    marginRight: 10
  },
  projectsContainer: {
    marginVertical: 40
  },
  deleteContainer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0
  },
  imageContainer: {
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    paddingTop: 60
  }
});

export default Dashboard;
