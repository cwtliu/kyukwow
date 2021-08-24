import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider } from 'semantic-ui-react';
import ReactPlayer from 'react-player'

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    }
  }
  render() {
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
        <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
        <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
      </div>
    );
  }
}
export default Video;
