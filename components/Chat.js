import React, { Component } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  backgroundColor,
} from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

// The application’s main Chat component that renders the chat UI
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      // messages state
      messages: [],
    };
  }
  componentDidMount() {
    //passes name from text input on Start screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.setState({
      messages: [
        // messages object list
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: `${name} has entered the chat`, // passes name prop to the system message
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }
  //appends message objects
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  //styles for the bubble messages on the right side
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2FC3F4",
          },
        }}
        textStyle={{
          right: {
            color: "#000",
          },
        }}
      />
    );
  }

  render() {
    //passes selected backgroundColor from  Start screen
    let bgColor = this.props.route.params.bgColor;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: bgColor,
        }}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
