import React, { Component } from "react";
import firebase from "firebase";
import "firebase/firestore";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import { AsyncStorage } from "react-native";
import NetInfo from "@react-native-community/netinfo";

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
      isConnected: false,
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  // get messages from async storage
  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  //save messages to async storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  // delete messages from async storage
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    //passes name from text input on Start screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.getMessages();
    // checks if app is online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        console.log("online");
        // looks for updates in chat messages collection
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);

        //authentication
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
              // return;
            }
            //updates state with user info
            this.setState({
              uid: user.uid,
              messages: [],
              user: {
                _id: user.uid,
                name: name,
                avatar: "https://placeimg.com/140/140/any",
              },
            });
            // Access stored messages of current user
            this.refMsgsUser = firebase
              .firestore()
              .collection("messages")
              .where("uid", "==", this.state.uid);
          });
        //saves messages to async storage when app is online
        this.saveMessages();
      } else {
        // If the app is offline
        this.setState({ isConnected: false });
        console.log("offline");
        // gets messages from asyncstorage
        this.getMessages();
      }
    });
  }
  //appends message objects
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();
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
    this.saveMessages();
  };

  componentWillUnmount() {
    if (this.state.isConnected) {
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      this.unsubscribe();
    }
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
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
