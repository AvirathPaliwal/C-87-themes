import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image, FlatList,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from 'react-native-vector-icons/Ionicons';
import StoryCard from "./StoryCard";

import * as Speech from 'expo-speech'

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { color } from "react-native-reanimated";
//import { FlatList } from "react-native-gesture-handler";
import firebase from "firebase";
let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

let stories = require("./temp_stories.json");

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            speakerColor: 'gray',
            speakerIcon: "headset-outline",
            light_theme:true
        };
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser()

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
        return <StoryCard story={mystory} navigation={this.props.navigation} />;
    }
    initiateTTS = async (title,author,story,moral) => {
        //async initiateTTS(){}
         const currentColor = this.state.speakerColor
         this.setState({
             speakerColor:currentColor==='gray'? 'orange':'gray'
         })
         if(currentColor === 'gray'){
             // ` back tick 
             // $ {} placeholder symbol
             Speech.speak(`${title} by ${author}`)
             Speech.speak(story)
             Speech.speak('moral of the story is')
             Speech.speak(moral)
         }
         else{
             Speech.stop();
         }
    }



    render() {
        if (!this.state.fontsLoaded) {
            // !true = fale
            return <AppLoading />;
        }
        else {

            return (
                <View style={ this.state.light_theme? styles.containerLight:styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={styles.appTitle}>
                        <View style={styles.appIcon}>
                            <Image
                                source={require("../assets/logo.png")}
                                style={styles.iconImage} />
                        </View>
                        <View style={styles.appTitleTextContainer}>
                            <Text style={this.state.light_theme? styles.appTitleTextLight:styles.appTitleText}> Story Hub </Text>
                        </View>
                    </View>

                    <View style={styles.storyContainer}>
                        <ScrollView style={this.state.light_theme? styles.storycardLight:styles.storycard}>
                            <Image
                                source={require('../assets/story_image_1.png')}
                                style={styles.image}
                            />
                            <View style={styles.dataContainer}>
                                <View style={styles.titleTextContainer}>
                                    <Text style={this.state.light_theme? styles.storyTitleTextLight:styles.storyTitleText}>
                                        {this.props.route.params.story.title}
                                    </Text>
                                    <Text style={this.state.light_theme? styles.storyAuthorTextLight:styles.storyAuthorText}>
                                        {this.props.route.params.story.author}
                                    </Text>
                                    <Text style={this.state.light_theme? styles.storyAuthorTextLight:styles.storyAuthorText}>
                                        {this.props.route.params.story.created_on}
                                    </Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity onPress={() => {
                                        this.initiateTTS(
                                            this.props.route.params.story.title,
                                            this.props.route.params.story.author,
                                            this.props.route.params.story.story,
                                            this.props.route.params.story.moral
                                        )
                                    }}>
                                        <Ionicons name={this.state.speakerIcon}
                                            size={RFValue(30)}
                                            color={this.state.speakerColor}
                                            style={{ margin: RFValue(15) }} />

                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.storyTextContainer}>
                                <Text style={ this.state.light_theme?styles.storyTextLight:styles.storyText}>
                                    {this.props.route.params.story.story}
                                </Text>
                                <Text style={this.state.light_theme?styles.moralTextLight:styles.moralText}>
                                    Moral - {this.props.route.params.story.moral}
                                </Text>
                            </View>
                            <View style={styles.actionContainer}>
                                <View style={styles.likeButton}>
                                    <Text style={this.state.light_theme?styles.likeTextLight:styles.likeText}>
                                        100K
                                    </Text>
                                    <Ionicons 
                                    name={'heart'} 
                                    size={RFValue(30)} 
                                    color={this.state.light_theme?'black':'white'} />
                                </View>

                            </View>

                        </ScrollView>
                    </View>


                </View>


            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#15193c',
    },
    containerLight: {
        flex: 1,
        backgroundColor: 'white',
    },
    droidSafeArea: {
        marginTop:
            Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
    },
    appTitle: {
        flex: 0.07,
        flexDirection: 'row',
    },
    appIcon: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    appTitleTextContainer: {
        flex: 0.7,
        justifyContent: 'center',
    },
    appTitleText: {
        color: 'white',
        fontSize: RFValue(28),
        fontFamily: 'Bubblegum-Sans',
    },
    appTitleTextLight: {
        color: 'black',
        fontSize: RFValue(28),
        fontFamily: 'Bubblegum-Sans',
    },
    storyContainer: {
        flex: 1,
    },
    storyCard: {
        margin: RFValue(20),
        backgroundColor: '#2f345d',
        borderRadius: RFValue(20),
    },
    storycardLight: {
        margin: RFValue(20),
        backgroundColor: 'white',
        borderRadius: RFValue(20),
    },
    image: {
        width: '100%',
        alignSelf: 'center',
        height: RFValue(200),
        borderTopLeftRadius: RFValue(20),
        borderTopRightRadius: RFValue(20),
        resizeMode: 'contain',
    },
    dataContainer: {
        flexDirection: 'row',
        padding: RFValue(20),
    },
    titleTextContainer: {
        flex: 0.8,
    },
    storyTitleText: {
        fontFamily: 'Bubblegum-Sans',
        fontSize: RFValue(25),
        color: 'white',
    },
    storyAuthorText: {
        fontFamily: 'Bubblegum-Sans',
        fontSize: RFValue(18),
        color: 'white',
    },
    storyTitleTextLight: {
        fontFamily: 'Bubblegum-Sans',
        fontSize: RFValue(25),
        color: 'black',
    },
    storyAuthorTextLight: {
        fontFamily: 'Bubblegum-Sans',
        fontSize: RFValue(18),
        color: 'black',
    },
    iconContainer: {
        flex: 0.2,
    },
    storyTextContainer: {
        padding: RFValue(20),
    },
    storyText: {
        fontFamily: 'Bubblegum-Sans',
        fontSize: RFValue(15),
        color: 'white',
    },
    moralText: {
        fontFamily: 'Bubblegum-Sans',
        fontSize: RFValue(20),
        color: 'white',
    },
    storyTextLight: {
        fontFamily: 'Bubblegum-Sans',
        fontSize: RFValue(15),
        color: 'black',
    },
    moralTextLight: {
        fontFamily: 'Bubblegum-Sans',
        fontSize: RFValue(20),
        color: 'black',
    },
    actionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: RFValue(10),
    },
    likeButton: {
        width: RFValue(160),
        height: RFValue(40),
        flexDirection: 'row',
        backgroundColor: '#eb3948',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: RFValue(30),
    },
    likeText: {
        color: 'white',
        fontFamily: 'Bubblegum-Sans',
        fontSize: RFValue(25),
        marginLeft: RFValue(5),
    },
});
