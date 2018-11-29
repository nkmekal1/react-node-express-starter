import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../../css/home-page.css';

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            titlePlaceholder: 'Give it a Title :)',
            titleValue: 'Give it a Title :)'
        };
    }

    handleClick = e => {
        if(e.target.textContent === this.state.titlePlaceholder) {
            this.setState({
                titleValue: ''
            });
        } 
    }

    handleFocusOut = e => {
        if(e.target.textContent === '') {
            this.setState({
                titleValue: this.state.titlePlaceholder
            })
        }
    }

    onImageSelected = e => {
        let selfThis = this;
        let selectedImage = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.addEventListener('load', () => {
            
            const blobResult = fileReader.result;            
            this.downscaleImage(blobResult, 1600)
            .then(compressedBlobResult => {
                selfThis.setState({
                    originalImageResult: fileReader.result,
                    compressedImageResult: compressedBlobResult
                }, () => {
                    axios.post('/upload', {
                        profileImage: compressedBlobResult
                    })
                    .then(response => {
                        console.log(response.data);
                    });
                });
            });
        });

        fileReader.readAsDataURL(selectedImage);
    }


    downscaleImage = function downscaleImage(dataUrl, newWidth, imageType, imageArguments) {

        return new Promise((resolve, reject) => {
            "use strict";
            var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;
        
            // Provide default values
            imageType = imageType || "image/jpeg";
            imageArguments = imageArguments || 0.7;
        
            // Create a temporary image so that we can compute the height of the downscaled image.
            image = new Image();
            image.src = dataUrl;
            window.setTimeout(() => {
                oldWidth = image.width;
                oldHeight = image.height;
                newHeight = Math.floor(oldHeight / oldWidth * newWidth)
            
                // Create a temporary canvas to draw the downscaled image on.
                canvas = document.createElement("canvas");
                canvas.width = newWidth;
                canvas.height = newHeight;
                var ctx = canvas.getContext("2d");
            
                // Draw the downscaled image on the canvas and return the new data URL.
                ctx.drawImage(image, 0, 0, newWidth, newHeight);
                newDataUrl = canvas.toDataURL(imageType, imageArguments);
                resolve(newDataUrl);
            }, 350);
        })
    }

    render() {
        return (
            <div className="row">
                <h3 id="title"
                    className={this.state.titleValue === this.state.titlePlaceholder ? ('placeholder-title') : ('title')} 
                    contentEditable="true"
                    suppressContentEditableWarning
                    onClick={this.handleClick}
                    onBlur={this.handleFocusOut}>{this.state.titleValue}</h3>

                    <input 
                        type="file"
                        name="profile-image"
                        accept="image/*"
                        onChange={this.onImageSelected}
                    ></input>
                    <img id="original-image-result" src={this.state.originalImageResult}></img>
                    <hr />
                    <img id="compressed-image-result" src={this.state.compressedImageResult}></img>
            </div>
        )
    }

}

ReactDOM.render(<App/>, document.getElementById('app'))