import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Popup, Loader, Grid, Checkbox, Image, Segment } from 'semantic-ui-react';
import ReactPlayer from 'react-player'
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import { API_URL, WEB_URL } from '../App.js';
import { Link } from 'react-router-dom';

// import {subtitles} from './transcription/cpb-aacip-127-558czhn9.h264.js';
import {scroller} from "react-scroll";
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import {endingToEnglishTerms, endingEnglishDescriptions} from './info/endingTerms.js';
import {YouTubeLinks} from './info/YouTubeLinks.js';

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

class Video extends Component {
  constructor(props) {
    super(props);
    this.ID = decodeURI(props.match.params.word);
    this.videoID = summaries[this.ID].videoID;
    this.state = {
      show: false,
      // audioURL: "https://yupikmodulesweb.s3.amazonaws.com/static/exercise1/"+this.videoID+".mp3",
      audioURL: WEB_URL + "/KyukAudioLibrary/" + this.videoID + ".mp3",
      videoURL: YouTubeLinks[this.videoID],
      isPlaying: false,
      startTime: null,
      endTime: null,
      currentSection: null,
      showTranslation: null,
      parses: [],
      firstParse: [],
      firstParseCount: 0,
      segments: [],
      endingrule: [],
      getCall:false,
      definitions:[],
      audioPlayerPlaying:false,
      videoPlayerPlaying:false,
      currentSentence: 1,
      summaries:summaries,
      // summary:summaries[this.ID].yugtun.summary[0],
      elderTags:summaries[this.ID].elderTags,
      tags:summaries[this.ID].tags,
      title:summaries[this.ID].title,
      date:summaries[this.ID].date,
      subtitles:{},
      nextSentenceStart: 0,
      currentTime:0,
      previousSentenceEnd:-1,
      clickedWordIndex:[-1,-1],
      // clickedSummaryIndex:-1,
      clickedChapterIndex:[-1,-1],
      currentVideoId: props.location.state === undefined ? false : this.videoID,
      // videoOnly:true,
      activeElementLocation: 'center',

    }
    this.audio = new Audio(this.state.audioURL);
    console.log(this.audio)
    // this.audio = new Audio(API_URL + "/kyukaudiolibrary/" +  this.videoID);
    // console.log(this.audio)
  }

  componentDidMount() {
  	// console.log(this.state.currentCPBID)
  	var circle = require('./transcription/'+this.videoID);
  	this.setState({ subtitles: circle.subtitles });
  	this.setState({ nextSentenceStart: circle.subtitles[2].startTime });
  	// console.log(subtitles,circle.subtitles)
    window.scrollTo(0, 0)
    this.intervalID = setInterval(
      () => this.tick(),
      600
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }


  tick() {

    var elmnt = document.getElementById('sentence'+this.state.currentSentence);
    var bounding = elmnt.getBoundingClientRect();
    var topOffset = 0
    if (this.props.innerWidth < 480) {
      topOffset = 138
    } else {
      topOffset = 138
    }
    console.log(bounding.top, bounding.bottom, document.documentElement.clientHeight)

    if (bounding.top >= topOffset && bounding.bottom <= document.documentElement.clientHeight) {
        // console.log('Element is in the viewport!');
        this.setState({ activeElementLocation: 'center'});
    } else if (bounding.top < topOffset) {
        // console.log('Element is ABOVE the viewport!');
        this.setState({ activeElementLocation: 'above'});
    } else {
        // console.log('Element is BELOW the viewport!');
        this.setState({ activeElementLocation: 'below'});
    }

    if (this.props.audioOnly) {
      this.setState({
        currentTime : this.rap.audio.current.currentTime,
      });
    } else {
      this.setState({
        currentTime : this.rep.player.prevPlayed,
      });
    }
  }

  componentDidUpdate(prevState) {
    if (this.state.endTime < this.audio.currentTime) {
       this.audio.pause();
    }


    // if (this.state.getCall !== prevState.getCall) {
    //   console.log(this.state.getCall)
    // }

    if (this.state.nextSentenceStart < this.state.currentTime) {
      let current = this.state.currentSentence;
      let i = 0;
      while (current+1+i !== Object.keys(this.state.subtitles).length+1 && this.state.subtitles[current+1+i].startTime < this.state.currentTime) {
        i=i+1;
      }
      // this.reference.current.scrollIntoView({
      // behavior: 'smooth',
      // block: 'center',
      // inline: 'center',
      // });       
      // console.log(elmnt.offsetWidth > 0 && elmnt.offsetHeight > 0)
      // console.log(document.getElementById('sentence'+(current+i)).offsetHeight)
      // if (document.getElementById('sentence'+(current+i)).offsetHeight) {
      // var elmnt = document.getElementById('sentence'+(current+i));
      // }

      if (i > 1) {
        var elmnt = document.getElementById('sentence'+(current+i));
        elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
      }

      if (current+1+i === Object.keys(this.state.subtitles).length+1) {
        this.setState({
          currentSentence: current+i,
          nextSentenceStart: this.rap.audioEl.current.duration,
          previousSentenceEnd: this.state.subtitles[current-1+i].endTime,
        });
      } else {
        this.setState({
          currentSentence: current+i,
          nextSentenceStart: this.state.subtitles[current+1+i].startTime,
          previousSentenceEnd: this.state.subtitles[current-1+i].endTime,
        });        
      }
    }


    if (this.state.previousSentenceEnd > this.state.currentTime) {
      let current = this.state.currentSentence;
      let i = 0;
      while (current-1+i !== 0 && this.state.subtitles[current-1+i].endTime > this.state.currentTime) {
        i=i-1;
      }

      if (i < -1) {
        var elmnt = document.getElementById('sentence'+(current+i));
        elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
      }


        this.setState({
          currentSentence: current+i,
          nextSentenceStart: this.state.subtitles[current+1+i].startTime,
        });        

      if (current-1+i === 0) {
        this.setState({
          previousSentenceEnd: 0,
        });
      } else {
        this.setState({
          previousSentenceEnd: this.state.subtitles[current-1+i].endTime,
        });
      }
    }

    // if (this.state.audioPlayerPlaying !== prevState.audioPlayerPlaying && this.rap !== null) {
    //   console.log(this.state.audioPlayerPlaying)
    //   if (this.state.audioPlayerPlaying) {
    //     null
    //     // if (this.state.nextSentenceStart < this.rap.audioEl.current.currentTime) {
    //     //   this.setState({
    //     //     currentSentence: this.state.currentSentence+1,
    //     //     nextSentenceStart: this.state.subtitles[this.state.currentSentence+2].startTime,
    //     //   });
    //     // }
    //   } else {
    //     console.log('hit')
    //     clearInterval(this.k)
    //     this.k = 0;
    //   }
    // }
  }


  getParse = (word) => {
    if (word === "") {
      this.setState({
          parses: [],
          segments: [],
          endingrule: [],
          getCall:false,
        })
    } else {
    axios
      .get(API_URL + "/parse/" + word)
      .then(response => {
        console.log(response.data.parses)  
        if (response.data.parses.length !== 0) {
        var firstParse = response.data.parses[0].split('-');
        this.setState({
          firstParse: firstParse,
          firstParseCount: firstParse.length,
        })
        }
        this.setState({
          parses: response.data.parses,
          segments: response.data.segments,
          endingrule: response.data.endingrule,
        });

        if (firstParse !== undefined) {
          var parse = "";
          var definitions = [];
          for (let i = 0; i < firstParse.length; i++) {
            parse = this.getLinks(i,firstParse);
            // console.log(firstParse,this.state.endingrule[0][0])
            if (i !== this.state.endingrule[0][0]) {
            axios
              .get(API_URL + "/word/" + parse)
              .then(response => {
                // console.log(response.data[1].definition)
                this.setState({definitions:this.state.definitions.concat(response.data[1].definition)}, ()=>{

                  if ((i === firstParse.length-1 && this.state.endingrule[0][0]==='')||(i === firstParse.length-2 && this.state.endingrule[0][0]!=='')||(i === firstParse.length-1 && this.state.endingrule[0][0]!=='')) {
                    this.setState({getCall:false})  
                  }
                  
                })
              });
            } 
          }
        } else {
          this.setState({getCall:false})  
        }
      });



    }
  }


  getLinks(index, parse) {
    // console.log(parse)
    if (index === 0) {            // if base
      if ((parse[index].includes("[P") || parse[index].includes("[I")) && parse.length === 1) {  // if particle or ignorative
        return parse[index].split("[")[0].replace(/=/g,"-");
      } else if (parse[index].includes("[PerPro]")) {
        return parse[index].split("[")[0]
      } else if (parse[index].includes("[DemPro]") || parse[index].includes("[DemAdv]")) {
        var dem = parse[index].replace("n[DemPro]","n'a")
        dem = dem.replace("[DemPro]","na")
        dem = dem.replace("[DemAdv]","(ni)")
        return dem
      } else {
        var base = parse[0];
        base = base.split(/\[[^e]/)[0] // remove special tag
        var dictionaryForm = '';
        // console.log("getLinks:",base,index,parse)
        if (parse[1].includes('[N')) {                      // if Noun base:
          dictionaryForm = base.replace(/([aeiu])te\b/, "$1n");              // Vte -> n
          dictionaryForm = dictionaryForm.replace(/([^\[])e\b/, "$1a")      // e -> a
          dictionaryForm = dictionaryForm.replace(/g\b/, "k");      // g -> k
          dictionaryForm = dictionaryForm.replace(/r(\*)?\b/, "q$1"); // r(*) -> q(*)
        } else if (parse[1].includes('[V') || parse[1].includes('[Q')) {
          dictionaryForm = base+"-"       // if Verb or Quant_Qual base 
        } else {
          dictionaryForm = base
        }
        return dictionaryForm.replace(/=/g,"-");          
      }
    } else {
    if (parse[index].includes("ete[N→V]")) {
          return "ete[N→V]"
        }
    }
    // else (["[N→N]","[N→V]","[V→V]","[V→N]","[Encl]"].some(v => parse[index].includes(v))) { //if postbase or enclitic
    return parse[index];
  }

  // retrieveDictTranslation = (word) => {
  //   axios
  //     .get(API_URL + "/word/" + word )
  //     .then(response => {
  //       this.setState({
  //         definition: response.data[1].definition,
  //       })
  //     });

  //   return this.state.defini
  // }

  endingToEnglish(ending,index,qindex) {
  const tags = [...ending.matchAll(/\[.*?\]/g)];
  var english1 = ""
  var english2 = ""
  var english3 = ""
  var english4 = ""
  var before = true;
  // console.log(this.state,tags[1])
  if (ending.includes('[V]')) {
    if (this.state.parses[index].includes('[Ind]') ||
        this.state.parses[index].includes('[Intrg]') ||
        this.state.parses[index].includes('[Opt]') ||
        this.state.parses[index].includes('[Sbrd]')) {
      before = false;
    }
    english1 += 'Verb Ending';
    english2 += endingToEnglishTerms[tags[1]];
    english4 += endingEnglishDescriptions[tags[1]];
    if (ending.includes('[Trns]')) {
    var subject = endingToEnglishTerms[tags[tags.length-2]]
    if (subject === undefined ) {
      subject = 'unspecified'
    }
      english3 += subject + " to " + endingToEnglishTerms[tags[tags.length-1]];

      } else if (ending.includes('[Intr]')) {
        english3 += endingToEnglishTerms[tags[tags.length-1]];
      }
    } else if (ending.includes('[N]')) {
      english1 += 'Noun Ending';
      english2 += endingToEnglishTerms[tags[1]];
      if (ending.includes('[Abs]')) {
        english4 = ""
      } else {
        english4 += endingEnglishDescriptions[tags[1]];
      }      
      if (ending.includes('Poss')) {
        english3 += endingToEnglishTerms[tags[tags.length-2]] + "\xa0" + endingToEnglishTerms[tags[tags.length-1]];
      } else {
        english3 += endingToEnglishTerms[tags[tags.length-1]];
      }
    } else if (this.state.parses[index].includes('[D')) {
      english1 += 'Demonstrative';
      english2 += endingToEnglishTerms[tags[0]];
      english4 += endingEnglishDescriptions[tags[0]];
      if (endingToEnglishTerms[tags[1]] !== undefined) {
        english3 += endingToEnglishTerms[tags[1]];        
      }
    } else if (this.state.parses[index].includes('[P')) {
      english1 += 'Personal Pronoun';
      english2 += endingToEnglishTerms[tags[0]];
      english4 += endingEnglishDescriptions[tags[0]];
      english3 += endingToEnglishTerms[tags[1]];        
    } else if (this.state.parses[index].includes('[Q')) {
      english1 = '';
      english2 += endingToEnglishTerms[tags[0]];
      english4 += endingEnglishDescriptions[tags[0]];
      if (endingToEnglishTerms[tags[1]] !== undefined) {
        english3 += endingToEnglishTerms[tags[1]];        
      }
    } else {
      english1 += ending;
      english2 += endingToEnglishTerms[tags[0]];
      english4 += endingEnglishDescriptions[tags[0]];
      if (endingToEnglishTerms[tags[1]] !== undefined) {
        english3 += endingToEnglishTerms[tags[1]];        
      } 
    }
    return (
    <div style={{paddingTop:15,paddingLeft:20*qindex}}>
    <div style={{fontWeight:'bold',fontSize:16,paddingBottom:'1px'}}>{this.state.endingrule[index][1].join(', ')}</div>
    <div style={{fontSize:16}}>
    {before && english4.length !== 0 ?
    <span>
    {english4+'\xa0'}
    </span>
    :
    null
    }
    <span>{english3}</span>
    {!before ?
    <span>
    {'\xa0'+english4}
    </span>
    :
    null
    }
    </div>
    </div>
    )
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
    console.log(this.state.videoPlayerPlaying)
    this.setState({
      endTime: this.state.subtitles[i].endTime,
      currentSection: i,
    });

    if (this.props.audioOnly) {
    this.rap.audioEl.current.pause();
    console.log(i)
    this.audio.currentTime = this.state.subtitles[i].startTime;
    this.audio.play();
    const timer = setTimeout(() => {
      this.audio.pause();
      this.setState({
        startTime: null,
        endTime: null,
        currentSection: null,
      });

    }, (this.state.subtitles[i].endTime-this.state.subtitles[i].startTime)*1000+1000); // added a second trailing
    // clearTimeout(timer);
    } else {
      this.rep.player.seekTo(this.state.subtitles[i].startTime)
      this.setState({videoPlayerPlaying:true})
      const timer = setTimeout(() => {
        this.setState({videoPlayerPlaying:false})  
        this.setState({
          startTime: null,
          endTime: null,
          currentSection: null,
        });

      }, (this.state.subtitles[i].endTime-this.state.subtitles[i].startTime)*1000+1000);

    }
  };

  moveToTime = (i) => {
    console.log(i) 
    var seconds = 0;
    var time = i.split(':');
    if (time.length === 2) {
      seconds = parseInt(time[0]*60) + parseInt(time[1]);
    } else {
      seconds = parseInt(time[0]*60*60) + parseInt(time[1]*60) + parseInt(time[2]);
    }
    this.setState({
      currentTime : seconds,
    });

    // console.log(this.props.audioOnly)
    if (this.props.audioOnly) {
      this.rap.audioEl.current.currentTime = seconds;
      this.rap.audioEl.current.play();      
    } else {
      this.rep.player.seekTo(seconds)
      this.setState({videoPlayerPlaying:true})
    }


  }



  render() {
    // console.log(this.state)
    // console.log(this.rep)
    // console.log(window.innerWidth-100)
    // var audio = document.getElementById("hello");
    // if (this.rap !== undefined) {
    //   if (!this.rap.audioEl.current.paused) {
    //     setInterval(()=>{console.log(this.rap.audioEl.current.currentTime);}, 5000);
    //   }
    // }
    // if (audio !== null) {
    //   if (!audio.paused) {
    //     setInterval(()=>{console.log(audio.currentTime);}, 5000);
    //   }
    // }
    // console.log(this.rep)
    // var clientHeight = this.rep.clientHeight;
    // console.log(clientHeight)
    let readerHeight = 0
    if (this.reader) {
      readerHeight = this.reader.clientHeight+14
    }
    let audioHeight = 88+14
    let topOffset = 138
    // let topOffsetAudio = 267

    var readerElementWidth = 0

    if (document.getElementById('readerelement')) {
      readerElementWidth = document.getElementById('readerelement').offsetWidth
    }


    return (
      <div className='about'>


      {this.props.innerWidth < 480 ?


     <div className='about'>

      <div style={{flex:1,display:'flex',justifyContent:'center',marginBottom:'10px'}}>
      <span style={{fontSize:'16px',color:'grey',paddingRight:'15px',fontWeight:'400',lineHeight:'23px',paddingBottom:'4px',fontFamily:"'Roboto', Arial, Helvetica"}}>Audio Only</span>
      <Checkbox toggle checked={this.props.audioOnly} onClick={this.props.audioHandler} />
      </div>

      {!this.props.audioOnly  ?
          <div class='reader' style={{paddingTop:'10px',position:'sticky', top:'0px',zIndex:9999}}>
            <div className='player-wrapper'>
            <ReactPlayer 
              className='react-player'
              controls
              url={this.state.videoURL} 
              ref={(element)=>{this.rep=element;}}
              width='100%'
              height='100%'
              playIcon
              onPlay={()=>{
                this.setState({audioPlayerPlaying:true})
                var elmnt = document.getElementById('sentence'+(this.state.currentSentence));
                elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
              }}
              onPause={()=>{this.setState({audioPlayerPlaying:false})}}
            />
            </div>
          </div>
        :
        <div class='reader' style={{paddingTop:'10px',position:'sticky', top:'0px',zIndex:9999}}>
          <AudioPlayer
            src={this.state.audioURL}
            controls
            // style={{position:'fixed','right':'3%','bottom':10,width:'94%',zIndex:10}}
            style={{width:'100%',zIndex:10}}
            ref={(element)=>{this.rap=element;}}
            onPlay={()=>{
              this.setState({audioPlayerPlaying:true})
              var elmnt = document.getElementById('sentence'+(this.state.currentSentence));
              elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
          }}
            onPause={()=>{this.setState({audioPlayerPlaying:false})}}
          />
        </div>
      }

            {this.props.audioOnly  ?
              <div>
                <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> Tegganret Qalartellret </div>
                  
                <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
                  {this.state.elderTags.map((y) => (
                    y in categories ?
                    <div style={{display:'flex',flexDirection:'column',margin:'10px',width:'120px'}}>
                      <Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
                      <Image style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
                      {categories[y]['name'].includes('~') ?
                      <div>
                      <div style={{color:'#333333',display:'flex',justifyContent:'center',fontSize:'16px',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
                      <div style={{color:'#333333',display:'flex',justifyContent:'center',fontSize:'16px'}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
                      </div>
                      :
                      <div style={{color:'#333333',display:'flex',justifyContent:'center',fontSize:'16px'}}>{categories[y]['name'].split('--')[0]}</div>
                      }
                      </Link>
                    </div>
                    :
                    null
                  ))}
                </div>
              </div>
              :
              null
            }

              <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> Tag-at </div>
              
              <div style={{textAlign:'center',lineHeight:'34px',fontSize:'16px'}}>
              {this.state.elderTags.map((y)=>(
                y in categories ?
                <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
                  <Button basic color='blue' compact>
                  {/*{categories[y].name.replaceAll('--','—')}*/}
                  {categories[y].name.split(' -- ')[0]}
                  </Button>
                </Link>
                :
                null
              ))}

              {this.state.tags.map((y)=>(
                y in categories ?
                <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
                  <Button basic compact>
                  {/*{categories[y].name.replaceAll('--','—')}*/}
                  {categories[y].name.split(' -- ')[0]}
                  </Button>
                </Link>
                :
                null
              ))}
              <Popup
                trigger={<Icon size='large' style={{color:'#d4d4d4',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={this.state.tags.map((y)=><div style={{fontSize:'16px'}}>{y}</div>)}
                position='bottom left'
              />
              </div>



          <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'15px'}}> Chapter-aat </div>

          {summaries[this.ID].summary.map((y,yindex) => (
            <div class='reader' style={{fontSize:'17px',lineHeight:'24px'}}>


            {this.state.activeElementLocation === 'above' ?
              <span style={{position:'fixed',zIndex:9999,right:(readerElementWidth/2),}}><Icon style={{top:'15px', cursor:'pointer'}} color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron up' /></span>
              :
              null
            }
            
            <Grid style={{padding:0,margin:0}}>
            <Grid.Row style={{paddingTop:0}} columns={2}>
              <Grid.Column width={3}>
                <div style={{color:'#5c8fa9',cursor:'pointer'}} onClick={() => this.moveToTime(y[0])}>
                {y[0]}
                </div>
              </Grid.Column>
              <Grid.Column width={13}>

              {y[1].split(" ").map((k,kindex) => (
                <Popup
                  trigger={<span style={{color:(kindex === this.state.clickedChapterIndex[0] && yindex === this.state.clickedChapterIndex[1] ? '#78b7d6' : 'black' )}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,clickedChapterIndex:[kindex,yindex]});
                      this.getParse(k.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());
                    }
                  }
                  }>{k+'\n'}</span>}
                  onClose={()=>this.setState({
                    clickedChapterIndex:[-1,-1],
                    definitions:[],
                    parses: [],
                    segments: [],
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    (
                    this.state.parses.length !== 0 && this.state.segments.length !== 0 ?
                      <div>
                      <div style={{fontSize:22}}>{this.state.segments[0].replace(/>/g,'·')}</div>
                      {this.state.parses[0].split('-').map((q,qindex) =>
                        (qindex === this.state.endingrule[0][0] ?
                          this.endingToEnglish(q,0,qindex)
                          :
                          (qindex > this.state.endingrule[0][0] ?
                            <div style={{paddingTop:15,paddingLeft:(qindex)*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {this.state.firstParse[qindex]}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex-1]}
                                </div>
                            </div>
                            :
                            <div style={{paddingTop:15,paddingLeft:qindex*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {q}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex]}
                                </div>
                            </div>
                            )
                        ))}
                      </div>
                    :
                    <div style={{fontSize:'16px'}}>{'No Results'}</div>
                    )
                    :
                    <div style={{height:'70px',width:'60px'}}>
                    <Loader active>Loading</Loader>
                    </div>
                  }
                  mouseEnterDelay={800}
                  mouseLeaveDelay={800}
                  position='bottom left'
                />
              ))}
              <Popup
                trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{summaries[this.ID].summary[yindex][2]}</div>}
                position='bottom left'
              />

              </Grid.Column>
            </Grid.Row>
            </Grid>
            </div>
          ))}        


        <div class='reader'>
        <div style={{textAlign:'center',fontSize:'25px',fontWeight:'bold',lineHeight:'45px',paddingTop:'20px'}}> Reader-aaq </div>
        {Object.keys(this.state.subtitles).map((i, index) => (
          <span class='reader-text'>
          <Icon name='play circle' style={{color:'#d4d4d4'}} link onClick={() => {
            this.playSection(i);
            this.rap.audioEl.current.pause();
            this.setState({audioPlayerPlaying:false});
          }} />
          <span id={'sentence'+i} style={{color:(i === this.state.currentSection || (this.state.audioPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ), borderBottom:(i === this.state.currentSection ? '5px solid #bee0f1' : '' )}}>
          {this.state.subtitles[i].transcript.split(' ').map((j,jindex) => (
            <Popup
              trigger={<span style={{color:(index === this.state.clickedWordIndex[0] && jindex === this.state.clickedWordIndex[1] ? '#78b7d6' :(i === this.state.currentSection || (this.state.audioPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ))}} onClick={() => {
                console.log(this.state.getCall);
                if (!this.state.getCall) {
                  this.setState({getCall:true,clickedWordIndex:[index,jindex]});
                  this.getParse(j.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());
                }
              }
              }>{j+'\n'}</span>}
              onClose={()=>this.setState({
                clickedWordIndex:[-1,-1],
                definitions:[],
                parses: [],
                segments: [],
                // endingrule: [],
                // getCall:false,
              })}
              on='click'
              content={
                !this.state.getCall ? 
                (
                this.state.parses.length !== 0 && this.state.segments.length !== 0 ?
                  <div>
                  <div style={{fontSize:22}}>{this.state.segments[0].replace(/>/g,'·')}</div>
                  {this.state.parses[0].split('-').map((q,qindex) =>
                    (qindex === this.state.endingrule[0][0] ?
                      this.endingToEnglish(q,0,qindex)
                      :
                      (qindex > this.state.endingrule[0][0] ?
                        <div style={{paddingTop:15,paddingLeft:(qindex)*20,fontSize:'16px'}}>
                            <div>
                            <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                            <div>
                            {this.state.firstParse[qindex]}
                            </div>
                            </div>                  
                            {this.state.definitions[qindex-1]}
                            </div>
                        </div>
                        :
                        <div style={{paddingTop:15,paddingLeft:qindex*20,fontSize:'16px'}}>
                            <div>
                            <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                            <div>
                            {q}
                            </div>
                            </div>                  
                            {this.state.definitions[qindex]}
                            </div>
                        </div>
                        )
                    ))}
                  </div>
                :
                <div style={{fontSize:'16px'}}>{'No Results'}</div>
                )
                :
                <div style={{height:'70px',width:'60px'}}>
                <Loader active>Loading</Loader>
                </div>
              }
              mouseEnterDelay={800}
              mouseLeaveDelay={800}
              position='bottom left'
            />
            )
          )}
          </span>

          {i === this.state.showTranslation ? 
            <p>{this.state.subtitles[i].translation}</p>
            :
            null
          }
          <Popup
            trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
            on='click'
            content={<div style={{fontSize:'16px'}}>{this.state.subtitles[i].translation}</div>}
            position='bottom left'
          />
          {'\n\n\n'}
          </span>
          )
        )}
      </div>

      <div>

      </div>

      </div>

        :

        (this.props.audioOnly ?

        <Grid>

        <Grid.Row columns={2}>
        <Grid.Column width={7}>
  
            <AudioPlayer
              src={this.state.audioURL}
              controls
              // style={{position:'fixed','right':'3%','bottom':10,width:'94%',zIndex:10}}
              style={{width:'98%',marginLeft:'2px'}}
              ref={(element)=>{this.rap=element;}}
              onPlay={()=>{
                this.setState({audioPlayerPlaying:true})
                var elmnt = document.getElementById('sentence'+(this.state.currentSentence));
                elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
              }}
              onPause={()=>{this.setState({audioPlayerPlaying:false})}}
            />
            <Segment vertical style={{fontSize:22,marginTop:14,padding:0,maxHeight:this.props.innerHeight-topOffset-audioHeight,overflow: 'auto',borderBottom:'#f6f6f6 1px solid',borderTop:'#f6f6f6 1px solid'}}>



              <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> Tegganret Qalartellret </div>
                
              <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
                {this.state.elderTags.map((y) => (
                  y in categories ?
                  <div style={{display:'flex',flexDirection:'column',margin:'10px',width:'120px'}}>
                    <Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
                    <Image style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
                    {categories[y]['name'].includes('~') ?
                    <div>
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',fontSize:'16px',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',fontSize:'16px'}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
                    </div>
                    :
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',fontSize:'16px'}}>{categories[y]['name'].split('--')[0]}</div>
                    }
                    </Link>
                  </div>
                  :
                  null
                ))}
              </div>

              <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> Tag-at </div>
              
              <div style={{textAlign:'center',lineHeight:'34px',fontSize:'16px'}}>
              {this.state.elderTags.map((y)=>(
                y in categories ?
                <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
                  <Button basic color='blue' compact>
                  {/*{categories[y].name.replaceAll('--','—')}*/}
                  {categories[y].name.split(' -- ')[0]}
                  </Button>
                </Link>
                :
                null
              ))}

              {this.state.tags.map((y)=>(
                y in categories ?
                <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
                  <Button basic compact>
                  {/*{categories[y].name.replaceAll('--','—')}*/}
                  {categories[y].name.split(' -- ')[0]}
                  </Button>
                </Link>
                :
                null
              ))}
              <Popup
                trigger={<Icon size='large' style={{color:'#d4d4d4',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={this.state.tags.map((y)=><div style={{fontSize:'16px'}}>{y}</div>)}
                position='bottom left'
              />
              </div>



          <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'15px'}}> Chapter-aat </div>

          {summaries[this.ID].summary.map((y,yindex) => (
            <div class='reader' style={{fontSize:'17px',lineHeight:'24px'}}>
            <Grid style={{padding:0,margin:0}}>
            <Grid.Row style={{paddingTop:0}} columns={2}>
              <Grid.Column width={3}>
                <div style={{color:'#5c8fa9',cursor:'pointer'}} onClick={() => this.moveToTime(y[0])}>
                {y[0]}
                </div>
              </Grid.Column>
              <Grid.Column width={13}>

              {y[1].split(" ").map((k,kindex) => (
                <Popup
                  trigger={<span style={{color:(kindex === this.state.clickedChapterIndex[0] && yindex === this.state.clickedChapterIndex[1] ? '#78b7d6' : 'black' )}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,clickedChapterIndex:[kindex,yindex]});
                      this.getParse(k.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());
                    }
                  }
                  }>{k+'\n'}</span>}
                  onClose={()=>this.setState({
                    clickedChapterIndex:[-1,-1],
                    definitions:[],
                    parses: [],
                    segments: [],
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    (
                    this.state.parses.length !== 0 && this.state.segments.length !== 0 ?
                      <div>
                      <div style={{fontSize:22}}>{this.state.segments[0].replace(/>/g,'·')}</div>
                      {this.state.parses[0].split('-').map((q,qindex) =>
                        (qindex === this.state.endingrule[0][0] ?
                          this.endingToEnglish(q,0,qindex)
                          :
                          (qindex > this.state.endingrule[0][0] ?
                            <div style={{paddingTop:15,paddingLeft:(qindex)*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {this.state.firstParse[qindex]}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex-1]}
                                </div>
                            </div>
                            :
                            <div style={{paddingTop:15,paddingLeft:qindex*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {q}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex]}
                                </div>
                            </div>
                            )
                        ))}
                      </div>
                    :
                    <div style={{fontSize:'16px'}}>{'No Results'}</div>
                    )
                    :
                    <div style={{height:'70px',width:'60px'}}>
                    <Loader active>Loading</Loader>
                    </div>
                  }
                  mouseEnterDelay={800}
                  mouseLeaveDelay={800}
                  position='bottom left'
                />
              ))}
              <Popup
                trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{summaries[this.ID].summary[yindex][2]}</div>}
                position='bottom left'
              />

              </Grid.Column>
            </Grid.Row>
            </Grid>
            </div>
          ))}



            </Segment>




        </Grid.Column>
        <Grid.Column width={9}>
          <Segment vertical id='readerelement' style={{fontSize:22,padding:0,maxHeight:this.props.innerHeight-topOffset,overflow: 'auto',borderBottom:'#f6f6f6 1px solid',borderTop:'#f6f6f6 1px solid'}}>
            

            {this.state.activeElementLocation === 'above' ?
              <span style={{position:'fixed',zIndex:9999,right:(readerElementWidth/2),}}><Icon style={{top:'15px', cursor:'pointer'}} color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron up' /></span>
              :
              null
            }

            <div style={{textAlign:'center',fontSize:'30px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> Reader-aaq </div>
            {Object.keys(this.state.subtitles).map((i, index) => (
              <span class='reader-text'>
              <Icon name='play circle' style={{color:'#d4d4d4'}} link onClick={() => {
                this.setState({videoPlayerPlaying:false, currentSection: null,},()=>{
                  this.playSection(i);
                });
              }} />
              <span id={'sentence'+i} style={{color:(i === this.state.currentSection || (this.state.audioPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ), borderBottom:(i === this.state.currentSection ? '5px solid #bee0f1' : '' )}}>
              {this.state.subtitles[i].transcript.split(' ').map((j,jindex) => (
                <Popup
                  trigger={<span style={{cursor:'pointer',color:(index === this.state.clickedWordIndex[0] && jindex === this.state.clickedWordIndex[1] ? '#78b7d6' :(i === this.state.currentSection || (this.state.audioPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ))}} onClick={() => {
                    console.log(this.state.getCall);
                    if (!this.state.getCall) {
                      this.setState({getCall:true,clickedWordIndex:[index,jindex]});
                      this.getParse(j.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());
                    }
                  }
                  }>{j+'\n'}</span>}
                  onClose={()=>this.setState({
                    clickedWordIndex:[-1,-1],
                    definitions:[],
                    parses: [],
                    segments: [],
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    (
                    this.state.parses.length !== 0 && this.state.segments.length !== 0 ?
                      <div>
                      <div style={{fontSize:22}}>{this.state.segments[0].replace(/>/g,'·')}</div>
                      {this.state.parses[0].split('-').map((q,qindex) =>
                        (qindex === this.state.endingrule[0][0] ?
                          this.endingToEnglish(q,0,qindex)
                          :
                          (qindex > this.state.endingrule[0][0] ?
                            <div style={{paddingTop:15,paddingLeft:(qindex)*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {this.state.firstParse[qindex]}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex-1]}
                                </div>
                            </div>
                            :
                            <div style={{paddingTop:15,paddingLeft:qindex*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {q}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex]}
                                </div>
                            </div>
                            )
                        ))}
                      </div>
                    :
                    <div style={{fontSize:'16px'}}>{'No Results'}</div>
                    )
                    :
                    <div style={{height:'70px',width:'60px'}}>
                    <Loader active>Loading</Loader>
                    </div>
                  }
                  mouseEnterDelay={800}
                  mouseLeaveDelay={800}
                  position='bottom left'
                />
                )
              )}
              </span>

              {i === this.state.showTranslation ? 
                <p>{this.state.subtitles[i].translation}</p>
                :
                null
              }
              <Popup
                // size='large'
                trigger={<Icon size='large' style={{color:'#d4d4d4',fontSize:'20px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{this.state.subtitles[i].translation}</div>}
                position='bottom left'
              />
              {'\n\n\n'}
              </span>
              )
            )}


            {this.state.activeElementLocation === 'below' ?
              <span style={{position:'sticky', bottom:'15px', right:(readerElementWidth/2-30), zIndex:9999}}><Icon style={{cursor:'pointer'}} color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron down' /></span>
              :
              null
            }


          </Segment>
        </Grid.Column>
        </Grid.Row>
        </Grid>
        

        :
        <Grid>
        <Grid.Row columns={2}>
        <Grid.Column width={7}>
          <div class='reader' ref={(element)=>{this.reader=element;}}>
            <div className='player-wrapper'>
            <ReactPlayer 
              className='react-player'
              controls
              url={this.state.videoURL} 
              ref={(element)=>{this.rep=element;}}
              width='100%'
              height='100%'
              playIcon
              playing={this.state.videoPlayerPlaying}
              onPlay={()=>{
                this.setState({videoPlayerPlaying:true})
                var elmnt = document.getElementById('sentence'+(this.state.currentSentence));
                elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
              }}
              onPause={()=>{this.setState({videoPlayerPlaying:false})}}
            />
            </div>
          </div>

            <Segment vertical style={{fontSize:22,marginTop:14,padding:0,maxHeight:this.props.innerHeight-readerHeight-topOffset,overflow: 'auto',borderBottom:'#f6f6f6 1px solid',borderTop:'#f6f6f6 1px solid'}}>

              <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> Tag-at </div>
              
              <div style={{textAlign:'center',lineHeight:'34px',fontSize:'16px'}}>
              {this.state.elderTags.map((y)=>(
                y in categories ?
                <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
                  <Button basic color='blue' compact>
                  {/*{categories[y].name.replaceAll('--','—')}*/}
                  {categories[y].name.split(' -- ')[0]}
                  </Button>
                </Link>
                :
                null
              ))}

              {this.state.tags.map((y)=>(
                y in categories ?
                <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
                  <Button basic compact>
                  {/*{categories[y].name.replaceAll('--','—')}*/}
                  {categories[y].name.split(' -- ')[0]}
                  </Button>
                </Link>
                :
                null
              ))}
              <Popup
                trigger={<Icon size='large' style={{color:'#d4d4d4',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={this.state.tags.map((y)=><div style={{fontSize:'16px'}}>{y}</div>)}
                position='bottom left'
              />
              </div>



          <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'15px'}}> Chapter-aat </div>

          {summaries[this.ID].summary.map((y,yindex) => (
            <div class='reader' style={{fontSize:'17px',lineHeight:'24px'}}>
            <Grid style={{padding:0,margin:0}}>
            <Grid.Row style={{paddingTop:0}} columns={2}>
              <Grid.Column width={3}>
                <div style={{color:'#5c8fa9',cursor:'pointer'}} onClick={() => this.moveToTime(y[0])}>
                {y[0]}
                </div>
              </Grid.Column>
              <Grid.Column width={13}>

              {y[1].split(" ").map((k,kindex) => (
                <Popup
                  trigger={<span style={{color:(kindex === this.state.clickedChapterIndex[0] && yindex === this.state.clickedChapterIndex[1] ? '#78b7d6' : 'black' )}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,clickedChapterIndex:[kindex,yindex]});
                      this.getParse(k.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());
                    }
                  }
                  }>{k+'\n'}</span>}
                  onClose={()=>this.setState({
                    clickedChapterIndex:[-1,-1],
                    definitions:[],
                    parses: [],
                    segments: [],
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    (
                    this.state.parses.length !== 0 && this.state.segments.length !== 0 ?
                      <div>
                      <div style={{fontSize:22}}>{this.state.segments[0].replace(/>/g,'·')}</div>
                      {this.state.parses[0].split('-').map((q,qindex) =>
                        (qindex === this.state.endingrule[0][0] ?
                          this.endingToEnglish(q,0,qindex)
                          :
                          (qindex > this.state.endingrule[0][0] ?
                            <div style={{paddingTop:15,paddingLeft:(qindex)*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {this.state.firstParse[qindex]}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex-1]}
                                </div>
                            </div>
                            :
                            <div style={{paddingTop:15,paddingLeft:qindex*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {q}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex]}
                                </div>
                            </div>
                            )
                        ))}
                      </div>
                    :
                    <div style={{fontSize:'16px'}}>{'No Results'}</div>
                    )
                    :
                    <div style={{height:'70px',width:'60px'}}>
                    <Loader active>Loading</Loader>
                    </div>
                  }
                  mouseEnterDelay={800}
                  mouseLeaveDelay={800}
                  position='bottom left'
                />
              ))}
              <Popup
                trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{summaries[this.ID].summary[yindex][2]}</div>}
                position='bottom left'
              />

              </Grid.Column>
            </Grid.Row>
            </Grid>
            </div>
          ))}



            </Segment>




        </Grid.Column>
        <Grid.Column width={9}>
          <Segment vertical id='readerelement' style={{fontSize:22,padding:0,maxHeight:this.props.innerHeight-topOffset,overflow: 'auto',borderBottom:'#f6f6f6 1px solid',borderTop:'#f6f6f6 1px solid'}}>
            
            {this.state.activeElementLocation === 'above' ?
              <span style={{position:'fixed',zIndex:9999,right:(readerElementWidth/2),}}><Icon style={{top:'15px', cursor:'pointer'}} color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron up' /></span>
              :
              null
            }
            <div style={{textAlign:'center',fontSize:'30px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> Reader-aaq </div>
            {Object.keys(this.state.subtitles).map((i, index) => (
              <span class='reader-text'>
              <Icon name='play circle' style={{color:'#d4d4d4'}} link onClick={() => {
                this.setState({videoPlayerPlaying:false, currentSection: null,},()=>{
                  this.playSection(i);
                });
              }} />
              <span id={'sentence'+i} style={{color:(i === this.state.currentSection || (this.state.videoPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ), borderBottom:(i === this.state.currentSection ? '5px solid #bee0f1' : '' )}}>
              {this.state.subtitles[i].transcript.split(' ').map((j,jindex) => (
                <Popup
                  trigger={<span style={{cursor:'pointer',color:(index === this.state.clickedWordIndex[0] && jindex === this.state.clickedWordIndex[1] ? '#78b7d6' :(i === this.state.currentSection || (this.state.videoPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ))}} onClick={() => {
                    console.log(this.state.getCall);
                    if (!this.state.getCall) {
                      this.setState({getCall:true,clickedWordIndex:[index,jindex]});
                      this.getParse(j.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());
                    }
                  }
                  }>{j+'\n'}</span>}
                  onClose={()=>this.setState({
                    clickedWordIndex:[-1,-1],
                    definitions:[],
                    parses: [],
                    segments: [],
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    (
                    this.state.parses.length !== 0 && this.state.segments.length !== 0 ?
                      <div>
                      <div style={{fontSize:22}}>{this.state.segments[0].replace(/>/g,'·')}</div>
                      {this.state.parses[0].split('-').map((q,qindex) =>
                        (qindex === this.state.endingrule[0][0] ?
                          this.endingToEnglish(q,0,qindex)
                          :
                          (qindex > this.state.endingrule[0][0] ?
                            <div style={{paddingTop:15,paddingLeft:(qindex)*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {this.state.firstParse[qindex]}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex-1]}
                                </div>
                            </div>
                            :
                            <div style={{paddingTop:15,paddingLeft:qindex*20,fontSize:'16px'}}>
                                <div>
                                <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                                <div>
                                {q}
                                </div>
                                </div>                  
                                {this.state.definitions[qindex]}
                                </div>
                            </div>
                            )
                        ))}
                      </div>
                    :
                    <div style={{fontSize:'16px'}}>{'No Results'}</div>
                    )
                    :
                    <div style={{height:'70px',width:'60px'}}>
                    <Loader active>Loading</Loader>
                    </div>
                  }
                  mouseEnterDelay={800}
                  mouseLeaveDelay={800}
                  position='bottom left'
                />
                )
              )}
              </span>

              {i === this.state.showTranslation ? 
                <p>{this.state.subtitles[i].translation}</p>
                :
                null
              }
              <Popup
                // size='large'
                trigger={<Icon size='large' style={{color:'#d4d4d4',fontSize:'20px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{this.state.subtitles[i].translation}</div>}
                position='bottom left'
              />
              {'\n\n\n'}
              </span>
              )
            )}

            {this.state.activeElementLocation === 'below' ?
              <span style={{position:'sticky', bottom:'15px', right:(readerElementWidth/2-30), zIndex:9999}}><Icon style={{cursor:'pointer'}} color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron down' /></span>
              :
              null
            }

          </Segment>
        </Grid.Column>
        </Grid.Row>
        </Grid>
        )

      }




      </div>
    );
  }
}
export default Video;
