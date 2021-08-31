import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Popup } from 'semantic-ui-react';
import ReactPlayer from 'react-player'
import ReactAudioPlayer from 'react-audio-player';


let dict = {
  1: {
    startTime: 40.0,
    endTime: 52.0,
    transcription: "Kitak’ ayagceskuvgu  apeskia qaill’ uksuarmi up’ngelauciit atu’urkameggnek.",
    translation: "Now, when you start it, ask me how they started getting ready in the fall for what they would need to use.",
  },
  2: {
    startTime: 57.0,
    endTime: 58.9,
    transcription: "Tuaten aqumgaciquten?",
    translation: "Will you be sitting like that?",    
  },
  3: {
    startTime: 59.0,
    endTime: 62.0,
    transcription: "Ii-i, waten aqumgaurciqua.",
    translation: "Yes, I will be sitting like this.",    
  },
}

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      audioURL: "https://yupikmodulesweb.s3.amazonaws.com/static/exercise1/YugtunAnnotateTest.mp3",
      isPlaying: false,
      startTime: 40.00,
      endTime: 52.00,
      currentSection: null,
      showTranslation: null,
    }
    this.audio = new Audio(this.state.audioURL);
  }

  componentDidUpdate(prevState) {
    if (this.state.endTime < this.audio.currentTime) {
       this.audio.pause();
    }
  }

  playPause = () => {

    // Get state of song
    let isPlaying = this.state.isPlaying;

    if (isPlaying) {
      // Pause the song if it is playing
      this.audio.pause();
    } else {

      // Play the song if it is paused
      this.audio.play();
    }

    // Change the state of song
    this.setState({ isPlaying: !isPlaying });
  };

  skip = () => {

      this.audio.currentTime = this.state.startTime;

  };

  playSection = (i) => {
    this.setState({
      endTime: dict[i].endTime,
      currentSection: i,
    });
    this.audio.currentTime = dict[i].startTime;
    this.audio.play();
    const timer = setTimeout(() => {
      this.audio.pause();
      this.setState({
        startTime: null,
        endTime: null,
        currentSection: null,
      });

    }, (dict[i].endTime-dict[i].startTime)*1000+500); // added a half second trailing
    // clearTimeout(timer);
  };



  render() {
    console.log(this.state, this.audio.currentTime)
    return (
      <div className='about'>
        <h1>About Me</h1>
        <div className='player-wrapper'>
        <ReactPlayer 
       	  className='react-player'
       	  controls
          url='https://youtu.be/o-5RbyLwOtU' 
          width='100%'
          height='100%'
    //       config={{ file: {
		  //   tracks: [
		  //     {kind: 'subtitles', src: 'subs/chinese.vtt', srcLang: 'zh'},
		  //   ]
		  // }}}
        />
        </div>
        <ReactAudioPlayer
          src="https://yupikmodulesweb.s3.amazonaws.com/static/exercise1/YugtunAnnotateTest.mp3"
          controls
        />


        {[1,2,3].map(i => (
          <div>
          <button onClick={() => this.playSection(i)}>
          Play
          </button>
          <p style={{fontWeight:(i === this.state.currentSection ? 'bold' : 'normal' )}}>{dict[i].transcription}</p>

          {i === this.state.showTranslation ? 
            <p>{dict[i].translation}</p>
            :
            null
          }
          <Popup
            trigger={<button>Translate</button>}
            on='click'
            content={dict[i].translation}
            position='bottom left'
          />
          </div>
          )
        )}
      <div>
        {/* Show state of song on website */}
        <p />
        <p>
          {this.state.isPlaying ? 
            "Song is Playing " : 
            "Song is Paused "}
          {this.audio.currentTime}
        </p>

        {/* Button to call our main function */}
        <button onClick={() => this.playPause()}>
          Play | Pause
        </button>
        <button onClick={() => this.skip()}>
          skip
        </button>
      </div>

      </div>
    );
  }
}
export default Video;
