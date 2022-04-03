import React, { Component } from "react";
import { View, Text, backgroundColor } from "react-native";

// The application’s main Chat component that renders the chat UI
class Chat extends React.Component {
  render() {
    //passes name and backgroundColor from text Start screen
    let name = this.props.route.params.name;
    let bgColor = this.props.route.params.bgColor;

    this.props.navigation.setOptions({ title: name });

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bgColor,
        }}
      >
        <Text style={{ color: "#FFF" }}>Chat Screen!</Text>
      </View>
    );
  }
}
export default Chat;
