import React from 'react';
import {database, storage, storage1} from './firebase';
import {Div, Button, Group} from "@vkontakte/vkui";
import {
    Panel,
    ListItem,
    Spinner,
    Avatar,
    InfoRow,
    Link,
    Cell,
    List,
    Progress,
    Tabs,
    TabsItem,
    FixedLayout,
    View, PanelHeader, Epic
} from '@vkontakte/vkui';
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
var result = "";

var setResultState;


var setResultStateTrue = srst;
function srst (){this.setState({spinnerOn: true})};

export default class FileDialogue extends React.Component {
    constructor(props) {
        super(props);
        user_id = this.props.user_id;
        access_token = this.props.access_token;

        this.state = {file: '', videoUrl: '',
            spinnerOn : false,
            resultGetted: false
        };
        setResultState = this;
    }
    componentDidMount() {
        connect.subscribe((e) => {
            if (e.detail.type === 'VKWebAppCallAPIMethodResult') {
                this.setState({videoUrl: e.detail.data.response.upload_url});
                video_url = e.detail.data.response.upload_url;
                console.log(e.detail.data.response.upload_url);
                database.ref('urls').update({ post: video_url});
            } else {
                console.log(e.detail.type);
            }
        });
    }



    handleLoadVideo(e) {
        e.preventDefault();
        this.setState({spinnerOn: true});
        access_token = this.props.access_token;
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
            snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    database.ref('videos').push({ userid: user_id, postedvideo: downloadURL, mergedvideo: '', score: '-1'});

                    connect.send("VKWebAppCallAPIMethod",{"method": "stories.getVideoUploadServer", "request_id": "32test", "params": {"add_to_news": "1", "v":"5.101", "access_token":access_token}});
                    // database.ref('urls').update({ post: video_url});

                    const dataRef = database.ref('videos/');

                // dataRef.on('eve')
                dataRef.on('child_changed',function(snapshot) {

                    let dataObj = snapshot.val();

                    let videos = [];
                        console.log("mew", "ChildrenChanged");

                        if (dataObj !== undefined && dataObj !== null) {
                            console.log("mew", "Data is");
                            // alert('data is' );
                            // console.log("mew", dataObj)
                            // Object.keys(dataObj).forEach(key => {if(key==="score"){videos.push(dataObj[key])}});
                            result = dataObj["score"];
                            setResultState.setState({spinnerOn: false, resultGetted: true});

                            // console.log("mew", videos)
                            //
                            //
                            // videos = videos.map((v) => { return { mergedvideo: v.mergedvideo, postedvideo: v.postedvideo, score: v.score, userid: v.userid}});
                            // alert('SCORE'+videos.score)
                            // alert('mergedvideo'+videos.values()[0].mergedvideo)
                            //
                            // videos.forEach((v)=> {if (v.userid===user_id && v.mergedvideo!=null){ alert("Score" + v.score)}}  );
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

        if (this.state.spinnerOn){
            return <Div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Spinner size="large" style={{ marginTop: 20 }} />
            </Div>
        }
        else if(this.state.resultGetted) {return <Div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>Ваш результат: {result}</Div>}
        else {return <Div className="previewComponent">
            <FormLayout>
                <File  top="Загрузите видео и опубликуйте историю"
                       before={<Icon24Camera />}
                       size="xl"
                       level="secondary"
                       className="fileInput"
                       type="file"
                       onChange={(e) => this.handleLoadVideo(e)}/>
            </FormLayout>

        </Div>}

    }
}



