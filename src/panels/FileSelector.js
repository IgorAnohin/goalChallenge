import React from 'react';
import {database, storage, storage1} from './firebase';
import {Div, Button, Group} from "@vkontakte/vkui";
import FormLayout from "@vkontakte/vkui/dist/components/FormLayout/FormLayout";
import File from "@vkontakte/vkui/dist/components/File/File";
import Icon24Camera from "@vkontakte/icons/dist/24/camera";
import ReactPlayer from "react-player";
import connect from "@vkontakte/vkui-connect";

// eslint-disable-next-line
function buildFileSelector() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    return fileSelector;
}
var user_id = "0";
var access_token = "";
var video_url = "";
export default class FileDialogue extends React.Component {
    constructor(props) {
        super(props);
        user_id = this.props.user_id;
        access_token = this.props.access_token;

        this.state = {file: '', videoUrl: ''};
    }
    componentDidMount() {
        alert("SUBSCRIPVE");
        connect.subscribe((e) => {
            if (e.detail.type === 'VKWebAppCallAPIMethodResult') {
                this.setState({videoUrl: e.detail.data.response.upload_url});
                video_url = e.detail.data.response.upload_url;
                console.log(e.detail.data.response.upload_url);
                database.ref('urls').update({ post: video_url});
            } else {
                // alert(e.detail.type);
                // console.log(e.detail.type);
            }
        });
    }


    handleLoadVideo(e) {
        e.preventDefault();
        // alert("cfvghbjnkm");
        // alert("This token: " + this.props.access_token);
        access_token = this.props.access_token
        // alert("Global token: " + access_token);

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file
            });
        };
        reader.readAsDataURL(file);


        // let file = this.state.file;
        let storageRef = storage.ref();
        let uploadTask = storageRef.child("videos/"+file.name + "32");
        uploadTask.put(file).then(function(snapshot) {
            alert("ON");
            snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    alert(user_id + downloadURL);
                    database.ref('videos').push({ userid: user_id, postedvideo: downloadURL, mergedvideo: '', score: ''});

                    connect.send("VKWebAppCallAPIMethod",{"method": "stories.getVideoUploadServer", "request_id": "32test", "params": {"add_to_news": "1", "v":"5.101", "access_token":access_token}});
                    // database.ref('urls').update({ post: video_url});

                    const dataRef = database.ref('videos')
                    dataRef.on('child_changed',function(snapshot) {
                        let dataObj = snapshot.val();
                        let videos = [];
                        if (dataObj !== undefined && dataObj !== null) {
                            Object.keys(dataObj).forEach(key => videos.push(dataObj[key]));
                            videos = videos.map((v) => { return {userid: v.userid, mergedvideo: v.mergedvideo, postedvideo: v.postedvideo, score: v.score}});
                            videos.forEach((v)=> {if (v.userid===user_id && v.mergedvideo!=null){ alert("Score" + v.score)}}  );
                        }
                    });
                }).catch(function(error) {
                alert(error.message);
                });
            });


    }
    _handleSubmit(e) {
        e.preventDefault();
        console.log('handle uploading-', this.state.file);
    }


    render() {

        return (
            <Div className="previewComponent">

                <form onSubmit={(e) => this._handleSubmit(e)}>
                    <input className="fileInput"
                           type="file"
                           onChange={(e) => this.handleLoadVideo(e)}/>
                    <button className="submitButton"
                            type="submit"
                            onClick={(e) => this._handleSubmit(e)}>Upload Image
                    </button>
                </form>


                    {/*<input className="fileInput"*/}
                    {/*       type="file"*/}
                    {/*       onChange={(e) => this._handleImageChange(e)}/>*/}

                {/*<FormLayout>*/}
                {/*    <File top="Загрузите видео"*/}
                {/*          before={<Icon24Camera />}*/}
                {/*          size="xl"*/}
                {/*          level="secondary"*/}
                {/*          className="fileInput"*/}
                {/*          type="file"*/}
                {/*          onChange={(e) => this.handleLoadVideo(e)}/>*/}
                {/*</FormLayout>*/}

            </Div>
        )


    }
}


