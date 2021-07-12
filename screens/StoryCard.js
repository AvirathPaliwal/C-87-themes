import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image, FlatList,
    TouchableOpacity
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import Ionicons from "react-native-vector-icons/Ionicons";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            light_theme: true
        };
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();

    }

    async fetchUser() {
        let theme;
        await firebase
            .database()
            .ref('/users/' + firebase.auth().currentUser.uid)
            .on("value", (snapshot) => {
                theme = snapshot.val().current_theme;
                this.setState({ light_theme: theme==="light"  })
            })

    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts)
        this.setState({ fontsLoaded: true })
    }

    keyExtractor = (item, index) => index.toString();


    renderItem = ({ item: mystory }) => {
        return <StoryCard story={mystory} />;
    }



    render() {
        if (!this.state.fontsLoaded) {
            // !true = fale
            return <AppLoading />;
        }
        else {

            return (
                // <View style={styles.container}>
                <TouchableOpacity
                    style={styles.container}
                    onPress={() =>
                        this.props.navigation.navigate("StoryScreen",
                            { story: this.props.story })}
                >
                      <SafeAreaView style={styles.droidSafeArea} />
                    <View style={
                        this.state.light_theme ? styles.cardContainerLight: styles.cardContainer}>
                        <Image
                            source={require("../assets/story_image_1.png")}
                            style={styles.storyImage} />
                        <View style={styles.titleContainer}>
                            <Text style={
                               this.state.light_theme ? styles.storyTitleTextLight :  styles.storyTitleText }>
                                {this.props.story.title}</Text>
                            <Text style={
                               this.state.light_theme ? styles.storyAuthorTextLight :   styles.storyAuthorText}>{this.props.story.author}</Text>
                            <Text style={
                                 this.state.light_theme ? styles.descriptionTextLight : styles.descriptionText}>{this.props.story.description}</Text>
                        </View>
                        <View style={styles.actionContainer}>
                            <View style={styles.likeButton}>
                                <Text 
                                style={this.state.light_theme ? styles.likeTextLight: styles.likeText}>
                                100K
                                </Text>
                                <Ionicons 
                                name={'heart'} 
                                size={RFValue(30)} 
                                color={ this.state.light_theme ? 'black' : 'white' } />


                            </View>

                        </View>


                    </View>
                </TouchableOpacity >
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      },
    cardContainer: {
        margin: RFValue(13),
        backgroundColor: "#2f345d",
        borderRadius: RFValue(20)
    },
    cardContainerLight: {
        margin: RFValue(13),
        backgroundColor: "white",
        borderRadius: RFValue(20)
    },
    storyImage: {
        resizeMode: "contain",
        width: "95%",
        alignSelf: "center",
        height: RFValue(250)
    },
    titleContainer: {
        paddingLeft: RFValue(20),
        justifyContent: "center"
    },
    storyTitleText: {
        fontSize: RFValue(25),
        fontFamily: "Bubblegum-Sans",
        color: "white"
    },
    storyTitleTextLight: {
        fontSize: RFValue(25),
        fontFamily: "Bubblegum-Sans",
        color: "black"
    },
    storyAuthorText: {
        fontSize: RFValue(18),
        fontFamily: "Bubblegum-Sans",
        color: "white"
    },
    storyAuthorTextLight: {
        fontSize: RFValue(18),
        fontFamily: "Bubblegum-Sans",
        color: "black"
    },
    descriptionText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 13,
        color: "white",
        paddingTop: RFValue(10)
    },
    descriptionTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 13,
        color: "black",
        paddingTop: RFValue(10)
    },
    actionContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: RFValue(10)
    },
    likeButton: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#eb3948",
        borderRadius: RFValue(30)
    },
    likeText: {
        color: "white",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
    },
    likeTextLight: {
        color: "black",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
    }
});


