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

    // this.onAddMessage = this.onAddMessage.bind(this);
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
        alert(this.props.user);
      let videosObj = snapshot.val();
      let videos = [];
      if (videosObj !== undefined && videosObj !== null) {
          Object.keys(videosObj).forEach(key => videos.push(videosObj[key]));
          videos = videos.map((video) => { return {ev: video.ev, user: video.userid, url: video.video}});
          let videoUrl;
          videos.map((video)=>{if (video.user=="2018"){videoUrl=video.url}})
          this.setState(prevState => ({
            videoUrl: videoUrl,
          }));
      }
    });
  }

  // onAddMessage(event) {
  //   event.preventDefault();
  //   database.ref('videos').push({ev: this.input.value, userid: this.state.username, video: this.state.photo_url});
  //   this.input.setState({value: ""});
  // }

    // onAddVideo(event) {
    //     event.preventDefault();
    //     database.ref('videos').push({text: this.input.value, user: this.state.username, photo: this.state.photo_url});
    //     this.input.setState({value: ""});
    // }

  render() {
    return (
      <Div>
          {/*<ReactPlayer url='https://www.youtube.com/watch?v=djHksT0DCGQ' playing />*/}
          {/*<ReactPlayer url={this.state.videoUrl} playing />*/}
          <Gallery
              id="fff"
              slideWidth="100%"
              align="right"
              style={{ height: 150 }}
          >
              <div style={{ backgroundColor: 'var(--destructive)' }} >
                  <ReactPlayer url='https://www.youtube.com/watch?v=djHksT0DCGQ' playing wrapper="fff"/>

              </div>
          </Gallery>

          {/*<List>*/}
        {/*    {this.state.messages.map((message) => {*/}
        {/*     const _class = message.user === this.state.username ? 'message-left container' : 'message-right container';*/}
        {/*    return (*/}
        {/*        <Cell*/}
        {/*          className={_class}*/}
        {/*          before={<Avatar src={message.photo}/>}*/}
        {/*          description={message.text}*/}
        {/*        >*/}
        {/*          {message.user}*/}
        {/*        </Cell>*/}
        {/*    )*/}
        {/*    })}*/}
        {/*</List>*/}

          {/*<Vide src="../img/v.mp4" poster="../img/persik.png" />*/}
        {/*<Div>*/}
        {/*    <Textarea*/}
        {/*      id="input_area"*/}
        {/*      top="Любимая музыка"*/}
        {/*      onChange={this.onChange}*/}
        {/*      ref={node => this.input = node}*/}
        {/*      placeholder="Сообщение" />*/}
		{/*		    <Button size="xl" level="1" onClick={this.onAddMessage}>*/}
		{/*		    	Послать*/}
		{/*		    </Button>*/}
        {/*</Div>*/}
      </Div>
    );
  }
}
