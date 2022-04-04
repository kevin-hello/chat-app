import React, { Component } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Importing the default background image from the assets folder
import BackgroundImage from "../assets/background-image.png";

//Starting screen for the App
class Start extends React.Component {
  constructor(props) {
    super(props);

    //state will be updated with name from TextInput and backgroundColor chosen by the user
    this.state = { name: "", bgColor: "" };
  }
  //function to update background color

  changeBgColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  //color selection
  colors = {
    black: "#090C08",
    purple: "#474056",
    gray: "#8A95A5",
    green: "#B9C6AE",
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>ChatApp</Text>
          </View>

          <View style={styles.middleContainer}>
            <View style={styles.inputBox}>
              <TextInput
                accessible={true}
                style={styles.input}
                onChangeText={(text) => this.setState({ name: text })}
                value={this.state.name}
                placeholder="Your Name"
              />
            </View>
            <View style={styles.colorBox}>
              <Text style={styles.colorText}>Choose Background Color: </Text>
            </View>
            <View style={styles.colors}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="black background color"
                accessibilityHint="changes the chat screen background to black"
                style={styles.black}
                accessibilityRole="button"
                onPress={() => this.changeBgColor(this.colors.black)}
              ></TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="purple background color"
                accessibilityHint="changes the chat screen background to purple"
                style={styles.purple}
                accessibilityRole="button"
                onPress={() => this.changeBgColor(this.colors.purple)}
              ></TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="gray background color"
                accessibilityHint="changes the chat screen background to gray"
                style={styles.gray}
                accessibilityRole="button"
                onPress={() => this.changeBgColor(this.colors.gray)}
              ></TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="green background color"
                accessibilityHint="changes the chat screen background to green"
                style={styles.green}
                accessibilityRole="button"
                onPress={() => this.changeBgColor(this.colors.green)}
              ></TouchableOpacity>
            </View>
            <Pressable
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  bgColor: this.state.bgColor,
                })
              }
            >
              <Text style={styles.buttonText}>Go to Chat Screen</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
// stylesheet for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    height: "50%",
    width: "88%",
    alignItems: "center",
    paddingTop: 100,
  },

  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  middleContainer: {
    backgroundColor: "white",
    height: "44%",
    width: "88%",
    justifyContent: "space-around",
    alignItems: "center",
  },

  inputBox: {
    borderWidth: 2,
    borderRadius: 1,
    borderColor: "grey",
    width: "88%",
    height: 60,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
  },

  colorBox: {
    marginRight: "auto",
    paddingLeft: 15,
    width: "88%",
  },

  colorText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1,
  },
  colors: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
    paddingRight: 10,
    paddingLeft: 10,
  },

  black: {
    backgroundColor: "#090C08",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  purple: {
    backgroundColor: "#474056",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  gray: {
    backgroundColor: "#8A95A5",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  green: {
    backgroundColor: "#B9C6AE",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  button: {
    width: "88%",
    height: 70,
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
export default Start;
