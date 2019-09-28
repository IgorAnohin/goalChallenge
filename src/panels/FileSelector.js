import React from 'react';
import {database, storage, storage1} from './firebase';
import {Div} from "@vkontakte/vkui";
import FormLayout from "@vkontakte/vkui/dist/components/FormLayout/FormLayout";
import File from "@vkontakte/vkui/dist/components/File/File";
import Icon24Camera from "@vkontakte/icons/dist/24/camera";
import axios from 'axios';

// eslint-disable-next-line
function buildFileSelector() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    return fileSelector;
}

export default class FileDialogue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {file: '', imagePreviewUrl: ''};
    }

    _handleSubmit(e) {
        e.preventDefault();
        console.log('handle uploading-', this.state.file);
    }


    _handleImageChange(e) {
        e.preventDefault();


        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file)

        // let file = this.state.file;
        alert("file: "+file.name)
        let storageRef = storage.ref();
        let uploadTask = storageRef.child("videos/qwe/"+file.name).put(file);
        uploadTask.on(storage1.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case storage1.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case storage1.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function(error) {

                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;

                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            }, function() {
                // Upload completed successfully, now we can get the download URL
                alert(`${this.props.user}`);
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    database.ref('videos').push({ev: "cvbhnjk", userid: `${this.props.user}`, video: downloadURL});
                    alert('File available at' + downloadURL);
                });
            });
    }


         async getDataAxios(){
            const response =
                await axios.get("https://dog.ceo/api/breeds/list/all")
            alert(response.data)
          }


    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
// eslint-disable-next-line
            $imagePreview = (<img src={imagePreviewUrl}/>);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }

        return (
            <Div className="previewComponent">
                {/*<form onSubmit={(e) => this._handleSubmit(e)}>*/}
                {/*    <input className="fileInput"*/}
                {/*           type="file"*/}
                {/*           onChange={(e) => this._handleImageChange(e)}/>*/}
                {/*    <button className="submitButton"*/}
                {/*            type="submit"*/}
                {/*            onClick={(e) => this._handleSubmit(e)}>Upload Image*/}
                {/*    </button>*/}
                {/*</form>*/}
                {/*<div className="imgPreview">*/}
                {/*    {$imagePreview}*/}
                {/*</div>*/}
                <FormLayout>
                    <File top="Загрузите видео"
                          before={<Icon24Camera />}
                          size="xl"
                          level="secondary"
                          className="fileInput"
                          type="file"
                          onChange={(e) => this._handleImageChange(e)}/>
                </FormLayout>
            </Div>
        )


    }
}


