import React, { Component } from "react";
import firebase from "firebase";
import "firebase/firestore";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";
// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyATvAIJLPI1zaCl0yvBFhAWBhc88gEAat8",
  authDomain: "chat-app-34e42.firebaseapp.com",
  projectId: "chat-app-34e42",
  storageBucket: "chat-app-34e42.appspot.com",
  messagingSenderId: "1028172899184",
  appId: "1:1028172899184:web:75c3954b003cc92506e5b5",
  measurementId: "G-JGSKQM99WQ",
};

// The application’s main Chat component that renders the chat UI
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    //passes name from text input on Start screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

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
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
      }
    );
  }
  //Add messages to database
  addMessages() {
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: this.state.user,
    });
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
  // On update, sets the messages' state with the current data
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages: messages,
    });
  };

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
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
            _id: this.state.user._id,
            name: this.state.user.name,
            avatar: this.state.user.avatar,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
