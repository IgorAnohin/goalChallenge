import React, { Component } from 'react';
import { database } from './firebase';
import {Avatar, Div, Button, Textarea, List, Cell,Gallery} from '@vkontakte/vkui';
// import { Panel, ListItem, Button, Group, Div, Avatar, PanelHeader } from '@vkontakte/vkui';
import ReactPlayer from 'react-player'
// import Gallery from "@vkontakte/vkui/src/components/Gallery/Gallery";



export default class PlayVideo extends Component {
  constructor(data) {
    super();
    // alert(data);

    var username_str = (data.username !== undefined && data.username !== null) ? data.username : "Unknown";
    var photo_url = (data.photo_url !== undefined && data.photo_url !== null) ? data.photo_url : "https://vk.com/images/camera_200.png";

    this.state = {
      messages: [],
      username: username_str,
      photo_url: photo_url
    };

  }

  componentWillMount() {
    // console.log(this.state.username)
    // const messagesRef = database.ref('messages')
    //   .orderByKey()
    //   .limitToLast(100);
    // console.log("HELLO")
      const videoRef = database.ref('videos')
    //
    //
    videoRef.on('value', snapshot => {
      let videosObj = snapshot.val();
      let videos = [];
      if (videosObj !== undefined && videosObj !== null) {
          Object.keys(videosObj).forEach(key => videos.push(videosObj[key]));
          videos = videos.map((video) => { return {ev: video.ev, user: video.userid, url: video.video}});
          let videoUrl;
          videos.map((video)=>{if (video.user=="2018"){videoUrl=video.url}})
          this.setState(prevState => ({
            videoUrl: videoUrl
          }));
      }
    });
  }



  render() {
    return (
      <Div>
          <Gallery
              id="fff"
              slideWidth="100%"
              align="right"
              style={{ height: 150 }}
          >
              <div style={{ backgroundColor: 'ffffff' }} >
                  <ReactPlayer url='https://youtu.be/hDvDGjbVc7Q' playing wrapper="fff"/>

              </div>
          </Gallery>
      </Div>
    );
  }
}
