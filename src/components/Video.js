import React, { Component } from 'react';
import { Container, Header, Button, Label, Icon, Divider, Popup, Loader, Grid, Checkbox, Image, Segment, Modal } from 'semantic-ui-react';
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
import ReactGA from "react-ga4";
ReactGA.initialize("G-JZB9CXH4GJ")

const YUGTUNDOTCOM_URL = "https://www.yugtun.com/";

class Video extends Component {
  constructor(props) {
    super(props);
    this.ID = decodeURI(props.match.params.word);
    this.videoID = summaries[this.ID].videoID;
    var circle = require('./transcription/'+this.videoID);
    const params = new URLSearchParams(this.props.location.search);
    console.log(params.get('t'))
    this.state = {
      show: false,
      // audioURL: "https://yupikmodulesweb.s3.amazonaws.com/static/exercise1/"+this.videoID+".mp3",
      audioURL: API_URL + "/kyukaudiolibrary/" + this.videoID,
      videoURL: YouTubeLinks[this.videoID],
      isPlaying: false,
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
      subtitles:circle.subtitles,
      nextSentenceStart: circle.subtitles[2].startTime,
      differentStartIndex: params.get('t') ? params.get('t') : -1,
      showDifferentStartTimePopup:true,
      currentTime: 0,
      previousSentenceEnd:-1,
      clickedWordIndex:[-1,-1],
      // clickedSummaryIndex:-1,
      clickedChapterIndex:[-1,-1],
      clickedChapterIndex2:[-1,-1],
      currentVideoId: props.location.state === undefined ? false : this.videoID,
      // videoOnly:true,
      activeElementLocation: 'center',
      topOffset: 138,
      mobileAudioOffset: 78,
      mobileVideoOffset: 190,
      videoHeight: 0,
      readerElementWidth: 0,
      audioComponentHeight: 102,
      videoPlayer: null,

      yugtun: [],
      english: [],
      endingIndexes: [],
      parses: [],
      segments: [],
      links: [],
      parseIndex: 0,

    }
    // this.audio = new Audio(this.state.audioURL);
    // console.log(this.audio)
    // this.audio = new Audio(API_URL + "/kyukaudiolibrary/" +  this.videoID);
    // console.log(this.audio)
    this.updateReaderDimensions = this.updateReaderDimensions.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

  }

  componentDidMount() {
    // console.log(this.videoID)
    // var circle = require('./transcription/'+this.videoID);
    // this.setState({ subtitles: circle.subtitles });
    // this.setState({ nextSentenceStart: circle.subtitles[2].startTime });
    
    window.addEventListener("resize", this.updateReaderDimensions);
    window.addEventListener('scroll', this.handleScroll);

    if (this.videoPlayer) {
      this.setState({
        videoHeight: this.videoPlayer.clientHeight,
      });      
    }

    if (document.getElementById('readerelement') !== null) {
      this.setState({
        readerElementWidth: document.getElementById('readerelement').offsetWidth,
      });
    }

    // var topOffset = 0
    // if (this.props.innerWidth < 480) {
    //   if (this.props.audioOnly) {
    //     topOffset = this.state.mobileAudioOffset
    //   } else {
    //     topOffset = this.state.mobileVideoOffset        
    //   }
    // } else {
    //   topOffset = this.state.topOffset
    // }

    window.scrollTo(0, 0)


      // if (this.props.audioOnly) {
      //   this.intervalIDAudio = setInterval(
      //     () => this.tickAudio(),
      //     100
      //   );
      // } else {
      //   this.intervalID = setInterval(
      //     () => this.tick(),
      //     100
      //   );        
      // }



  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    clearInterval(this.intervalIDAudio);
    window.removeEventListener("resize", this.updateReaderDimensions);
    window.removeEventListener('scroll', this.handleScroll);
  }


  handleScroll() {
      var elmnt = document.getElementById('sentence'+this.state.currentSentence);
      var bounding = elmnt.getBoundingClientRect();

      var topOffset = 0
      if (this.props.innerWidth < 480) {
        if (this.props.audioOnly) {
          topOffset = this.state.mobileAudioOffset
        } else {
          topOffset = this.state.videoHeight        
        }
      } else {
        topOffset = this.state.topOffset
      }

      if (bounding.top >= topOffset && bounding.bottom <= document.documentElement.clientHeight || (!this.state.audioPlayerPlaying && !this.state.videoPlayerPlaying)) {
          // console.log('Element is in the viewport!');
          this.setState({ activeElementLocation: 'center'});
      } else if (bounding.top < topOffset) {
          // console.log('Element is ABOVE the viewport!');
          this.setState({ activeElementLocation: 'above'});
      } else {
          // console.log('Element is BELOW the viewport!');
          this.setState({ activeElementLocation: 'below'});
      }  
  }


  updateReaderDimensions() {

    if (this.videoPlayer) {
      this.setState({
        videoHeight: this.videoPlayer.clientHeight,
      });      
    }

    if (document.getElementById('readerelement') !== null) {
      this.setState({
        readerElementWidth: document.getElementById('readerelement').offsetWidth,
      });
    }
  }

  tick() {
    this.setState({
      currentTime : this.rep.player.prevPlayed,
    });
  }

  tickAudio() {
    this.setState({
      currentTime : this.rap.audio.current.currentTime,
    });
  }

  startTick = () => {
    if (this.props.audioOnly) {
      clearInterval(this.intervalID);
      this.intervalIDAudio = setInterval(
        () => this.tickAudio(),
        200
      );        
    } else {
      clearInterval(this.intervalIDAudio);
      this.intervalID = setInterval(
        () => this.tick(),
        200
      ); 
    }
  }
  componentDidUpdate(prevProps,prevState) {

    if (this.state.videoPlayerPlaying !== prevState.videoPlayerPlaying || this.state.audioPlayerPlaying !== prevState.audioPlayerPlaying) {
      // if (this.state.currentSentence === 1) {
        console.log('ran here',this.state.currentSentence,this.state.currentSection)
        let sentence = ''
        if (this.state.currentSection) {
          sentence = this.state.currentSection
        } else {
          sentence = this.state.currentSentence
        }
        var elmnt = document.getElementById('sentence'+sentence);
        var bounding = elmnt.getBoundingClientRect();
        if (!(bounding.top >= this.state.topOffset && bounding.bottom <= document.documentElement.clientHeight)) {
          elmnt.scrollIntoView({behavior: "smooth", block: "center"});  
        }       
      // }

      if (this.state.videoPlayerPlaying || this.state.audioPlayerPlaying) {
        this.startTick()
      } else {
        clearInterval(this.intervalID);
        clearInterval(this.intervalIDAudio);
      }

    }

    if (prevProps.audioOnly !== this.props.audioOnly) {
      clearInterval(this.intervalIDAudio);
      clearInterval(this.intervalID);
      if (this.videoPlayer) {
        this.setState({
          videoHeight: this.videoPlayer.clientHeight,
        });      
      }
      // this.startTick()
    }

    if (this.state.currentSentence !== prevState.currentSentence) {
      if (this.state.currentSection) {
        if (this.state.currentSentence.toString() !== this.state.currentSection && (this.state.currentSentence+1).toString() !== this.state.currentSection) {
          this.resetTimer()
        }
      }

      // if (this.timer) {
      //   console.log(this.timer, 'hi')
      // }
      var elmnt = document.getElementById('sentence'+this.state.currentSentence);
      var bounding = elmnt.getBoundingClientRect();


      var topOffset = 0
      if (this.props.innerWidth < 480) {
        if (this.props.audioOnly) {
          topOffset = this.state.mobileAudioOffset
        } else {
          topOffset = this.state.videoHeight        
        }
      } else {
        topOffset = this.state.topOffset
      }

      if (bounding.top >= topOffset && bounding.bottom <= document.documentElement.clientHeight || (!this.state.audioPlayerPlaying && !this.state.videoPlayerPlaying)) {
          // console.log('Element is in the viewport!');
          this.setState({ activeElementLocation: 'center'});
      } else if (bounding.top < topOffset) {
          // console.log('Element is ABOVE the viewport!');
          this.setState({ activeElementLocation: 'above'});
      } else {
          // console.log('Element is BELOW the viewport!');
          this.setState({ activeElementLocation: 'below'});
      }      
    }




    if (this.state.nextSentenceStart < this.state.currentTime) {
      // console.log('future')

      let current = this.state.currentSentence;
      let i = 0;
      while (current+1+i !== Object.keys(this.state.subtitles).length+1 && this.state.subtitles[current+1+i].startTime < this.state.currentTime) {
        i=i+1;
      }




      if (i > 1) {
        var elmnt = document.getElementById('sentence'+(current+i));
        var bounding = elmnt.getBoundingClientRect();
        if (!(bounding.top >= this.state.topOffset && bounding.bottom <= document.documentElement.clientHeight)) {
          // console.log('wadup',this.state.currentSentence,this.state.currentSection)
          elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
        }
      }
      // console.log(current+1+i)
      if (current+1+i === Object.keys(this.state.subtitles).length+1) {
        this.setState({
          currentSentence: current+i,
          nextSentenceStart: 1000000000000,
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
        var bounding = elmnt.getBoundingClientRect();
        if (!(bounding.top >= this.state.topOffset && bounding.bottom <= document.documentElement.clientHeight)) {
          elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
        }
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


  }


  getParse = (word) => {
    if (word === "") {
      this.setState({
          yugtun: [],
          english: [],
          endingIndexes: [],
          parses: [],
          segments: [],
          links: [],
          getCall:false,
          parseIndex: 0,
        })
    } else {
    axios
      .get(API_URL + "/parseV2/" + word)
      .then(response => {
        console.log(response)  
        if (response) {
        // var firstParse = response.data.parses[0].split('-');
        this.setState({
          // firstParse: response.data.firstParse,
          // firstSegment: response.data.firstParse,
          // firstEnding: response.data.firstParse,
          // firstParseCount: firstParse.length,
          yugtun: response.data.yugtun,
          english: response.data.english,
          endingIndexes: response.data.endingIndexes,
          parses: response.data.parses,
          segments: response.data.segments,
          links: response.data.links,
        },()=>{
          // if (firstParse !== undefined) {
          //   var parse = "";
          //   var definitions = [];
          //   for (let i = 0; i < firstParse.length; i++) {
          //     parse = this.getLinks(i,firstParse);
          //     // console.log(firstParse,this.state.endingrule[0][0])
          //     if (i !== this.state.endingrule[0][0]) {
          //     axios
          //       .get(API_URL + "/word/" + parse)
          //       .then(response => {
          //         if (response) {

          //         this.setState({definitions:this.state.definitions.concat(response.data[1].definition)}, ()=>{

          //           if ((i === firstParse.length-1 && this.state.endingrule[0][0]==='')||(i === firstParse.length-2 && this.state.endingrule[0][0]!=='')||(i === firstParse.length-1 && this.state.endingrule[0][0]!=='')) {
          //             this.setState({getCall:false})  
          //           }
                    
          //         })

          //         } else {
          //           this.setState({definitions:this.state.definitions.concat('')})
          //         }

          //       });
          //     } 
          //   }
          // } else {
            this.setState({getCall:false})  
          // }          
        })

        } else {
          this.setState({
            yugtun: [],
            english: [],
            endingIndexes: [],
            parses: [],
            segments: [],
            links: [],
            getCall:false,
            parseIndex: 0,
          })
        }



      });



    }
    }

    openInNewTab = (url) => {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }


  // getLinks(index, parse) {
  //   // console.log(parse)
  //   if (index === 0) {            // if base
  //     if ((parse[index].includes("[P") || parse[index].includes("[I")) && parse.length === 1) {  // if particle or ignorative
  //       return parse[index].split("[")[0].replace(/=/g,"-");
  //     } else if (parse[index].includes("[PerPro]")) {
  //       return parse[index].split("[")[0]
  //     } else if (parse[index].includes("[DemPro]") || parse[index].includes("[DemAdv]")) {
  //       var dem = parse[index].replace("n[DemPro]","n'a")
  //       dem = dem.replace("[DemPro]","na")
  //       dem = dem.replace("[DemAdv]","(ni)")
  //       return dem
  //     } else {
  //       var base = parse[0];
  //       base = base.split(/\[[^e]/)[0] // remove special tag
  //       var dictionaryForm = '';
  //       // console.log("getLinks:",base,index,parse)
  //       if (parse[1].includes('[N')) {                      // if Noun base:
  //         dictionaryForm = base.replace(/([aeiu])te\b/, "$1n");              // Vte -> n
  //         dictionaryForm = dictionaryForm.replace(/([^\[])e\b/, "$1a")      // e -> a
  //         dictionaryForm = dictionaryForm.replace(/g\b/, "k");      // g -> k
  //         dictionaryForm = dictionaryForm.replace(/r(\*)?\b/, "q$1"); // r(*) -> q(*)
  //       } else if (parse[1].includes('[V') || parse[1].includes('[Q')) {
  //         dictionaryForm = base+"-"       // if Verb or Quant_Qual base 
  //       } else {
  //         dictionaryForm = base
  //       }
  //       return dictionaryForm.replace(/=/g,"-");          
  //     }
  //   } else {
  //   if (parse[index].includes("ete[N→V]")) {
  //         return "ete[N→V]"
  //       }
  //   }
  //   // else (["[N→N]","[N→V]","[V→V]","[V→N]","[Encl]"].some(v => parse[index].includes(v))) { //if postbase or enclitic
  //   return parse[index];
  // }

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

//   endingToEnglish(ending,index,qindex) {
//   const tags = [...ending.matchAll(/\[.*?\]/g)];
//   var english1 = ""
//   var english2 = ""
//   var english3 = ""
//   var english4 = ""
//   var before = true;
//   // console.log(this.state,tags[1])
//   if (ending.includes('[V]')) {
//     if (this.state.parses[index].includes('[Ind]') ||
//         this.state.parses[index].includes('[Intrg]') ||
//         this.state.parses[index].includes('[Opt]') ||
//         this.state.parses[index].includes('[Sbrd]')) {
//       before = false;
//     }
//     english1 += 'Verb Ending';
//     english2 += endingToEnglishTerms[tags[1]];
//     english4 += endingEnglishDescriptions[tags[1]];
//     if (ending.includes('[Trns]')) {
//     var subject = endingToEnglishTerms[tags[tags.length-2]]
//     if (subject === undefined ) {
//       subject = 'unspecified'
//     }
//       english3 += subject + " to " + endingToEnglishTerms[tags[tags.length-1]];

//       } else if (ending.includes('[Intr]')) {
//         english3 += endingToEnglishTerms[tags[tags.length-1]];
//       }
//     } else if (ending.includes('[N]')) {
//       english1 += 'Noun Ending';
//       english2 += endingToEnglishTerms[tags[1]];
//       if (ending.includes('[Abs]')) {
//         english4 = ""
//       } else {
//         english4 += endingEnglishDescriptions[tags[1]];
//       }      
//       if (ending.includes('Poss')) {
//         english3 += endingToEnglishTerms[tags[tags.length-2]] + "\xa0" + endingToEnglishTerms[tags[tags.length-1]];
//       } else {
//         english3 += endingToEnglishTerms[tags[tags.length-1]];
//       }
//     } else if (this.state.parses[index].includes('[D')) {
//       english1 += 'Demonstrative';
//       english2 += endingToEnglishTerms[tags[0]];
//       english4 += endingEnglishDescriptions[tags[0]];
//       if (endingToEnglishTerms[tags[1]] !== undefined) {
//         english3 += endingToEnglishTerms[tags[1]];        
//       }
//     } else if (this.state.parses[index].includes('[P')) {
//       english1 += 'Personal Pronoun';
//       english2 += endingToEnglishTerms[tags[0]];
//       english4 += endingEnglishDescriptions[tags[0]];
//       english3 += endingToEnglishTerms[tags[1]];        
//     } else if (this.state.parses[index].includes('[Q')) {
//       english1 = '';
//       english2 += endingToEnglishTerms[tags[0]];
//       english4 += endingEnglishDescriptions[tags[0]];
//       if (endingToEnglishTerms[tags[1]] !== undefined) {
//         english3 += endingToEnglishTerms[tags[1]];        
//       }
//     } else {
//       english1 += ending;
//       english2 += endingToEnglishTerms[tags[0]];
//       english4 += endingEnglishDescriptions[tags[0]];
//       if (endingToEnglishTerms[tags[1]] !== undefined) {
//         english3 += endingToEnglishTerms[tags[1]];        
//       } 
//     }
//     return (
//     <div style={{paddingTop:15,paddingLeft:20*qindex}}>
//     <div style={{fontWeight:'bold',fontSize:16,paddingBottom:'1px'}}>{this.state.endingrule[index][1].join(', ')}</div>
//     <div style={{fontSize:16}}>
//     {before && english4.length !== 0 ?
//     <span>
//     {english4+'\xa0'}
//     </span>
//     :
//     null
//     }
//     <span>{english3}</span>
//     {!before ?
//     <span>
//     {'\xa0'+english4}
//     </span>
//     :
//     null
//     }
//     </div>
//     </div>
//     )
//   }


  resetTimer = () => {
    console.log('resetted')
    clearTimeout(this.timer)
    this.setState({currentSection:null})
  }

  playSectionContinue = (i) => {
    this.setState({
      currentSection: i,
    }, () => {
      this.rep.player.seekTo(this.state.subtitles[i].startTime)
      this.setState({videoPlayerPlaying:true})
      clearTimeout(this.timer)
    })
  }

  playSection = (i) => {
    // console.log(i)
    

    this.setState({
      currentSection: i,
    }, () => {

      if (this.props.audioOnly) {
      // this.rap.audio.current.pause();
      // console.log(i, this.rap, this.audio)
      this.rap.audio.current.currentTime = this.state.subtitles[i].startTime;
      this.rap.audio.current.play();
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.rap.audio.current.pause();
        this.setState({
          currentSection: null,
        });

      }, (this.state.subtitles[i].endTime-this.state.subtitles[i].startTime)*1000+500); // added a second trailing
      // clearTimeout(timer);
      } else {
        this.rep.player.seekTo(this.state.subtitles[i].startTime)
        this.setState({videoPlayerPlaying:true})
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.setState({videoPlayerPlaying:false})  
          this.setState({
            currentSection: null,
          });

        }, (this.state.subtitles[i].endTime-this.state.subtitles[i].startTime)*1000+500);
      }

    });

  };

  moveToTime = (i) => {
    // console.log(i) 
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
      this.rap.audio.current.currentTime = seconds;
      this.rap.audio.current.play();      
    } else {
      this.rep.player.seekTo(seconds)
      this.setState({videoPlayerPlaying:true})
    }


  }


  // checkIfScrollNeeded = () => {

  //   var elmnt = document.getElementById('sentence'+this.state.currentSentence);
  //   var bounding = elmnt.getBoundingClientRect();
  //   if (!(bounding.top >= this.state.topOffset && bounding.bottom <= document.documentElement.clientHeight)) {
  //     var elmnt = document.getElementById('sentence'+(this.state.currentSentence));
  //     elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
  //   }  


  // }

  tags = () => {
    return (<div><div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',paddingTop:'20px',paddingBottom:'15px'}}> 
      <span>Ayuqaitnek Nataqissuun</span>
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{'Category Tags'}</div>}
                position='bottom center'
              />
       </div>
              
              <div style={{textAlign:'center',lineHeight:'34px'}}>
              {this.state.elderTags.map((y)=>(
                y in categories ?
                <Link to={{pathname: '/category/'+categories[y]['url']}}>
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
                <Link to={{pathname: '/category/'+categories[y]['url']}}>
                  <Button basic compact>
                  {/*{categories[y].name.replaceAll('--','—')}*/}
                  {categories[y].name.split(' -- ')[0]}
                  </Button>
                </Link>
                :
                null
              ))}
              <Popup hideOnScroll
                trigger={<Icon size='large' style={{color:'#d4d4d4',paddingLeft:'3px',fontSize:'25px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                style={{zIndex:9999}}
                content={
                  <Segment vertical style={{maxHeight:300,overflow: 'auto',padding:0,margin:0}}>
                  {this.state.tags.map((y,yindex)=>
                    <div style={{display:'flex',fontSize:'14px',paddingTop:(yindex !== 0 ? '3px' : ''),marginTop:(yindex !== 0 ? '4px' : ''),borderTop:(yindex !== 0 ? '1px solid #f4f3f3' : '')}}>
                    <span style={{flex:1,color:'#00000099'}}>{categories[y].name.split('--')[0]}</span>
                    <span style={{flex:1,display:'flex',alignItems:'center',marginLeft:'5px'}}>
                    <span>{categories[y].name.split('--')[1]}</span>
                    </span>
                    </div>
                  )}
                  </Segment>
                  }
                position='bottom left'
              />
              </div>
              </div>
              )
  }

  summaryTags = (y, yindex) => {
          return (<Grid style={{padding:0,margin:0}}>
            <Grid.Row style={{paddingTop:0}} columns={2}>
              <Grid.Column width={3}>
                <div style={{color:'#5c8fa9',cursor:'pointer'}} onClick={() => this.moveToTime(summaries[this.ID].summary[y][0])}>
                {summaries[this.ID].summary[y][0]}
                </div>
              </Grid.Column>
              <Grid.Column width={13}>

              {summaries[this.ID].summary[y][1].split(" ").map((k,kindex) => (
                <Popup hideOnScroll
                  trigger={<span style={{cursor:'pointer',color:(kindex === this.state.clickedChapterIndex2[0] && yindex === this.state.clickedChapterIndex2[1] ? '#78b7d6' : 'black' )}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,english:[],clickedChapterIndex2:[kindex,yindex]},()=>{this.getParse(k.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());});
                    }
                  }
                  }>{k+'\n'}</span>}
                  disabled={this.state.getCall && kindex !== this.state.clickedChapterIndex2[0]}
                  onClose={()=>this.setState({
                    clickedChapterIndex2:[-1,-1],
                    yugtun: [],
                    english: [],
                    parses: [],
                    segments: [],
                    endingIndexes: [],
                    links: [],
                    parseIndex: 0,
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    this.parserPopup()
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
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{summaries[this.ID].summary[Object.keys(summaries[this.ID].summary)[yindex]][2]}</div>}
                position='bottom left'
              />

              </Grid.Column>
            </Grid.Row>
            </Grid>
            )

  }
  returnAqpaurtet = () => {
    return  <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',paddingTop:'23px',paddingBottom:'5px'}}> 
              <div>
                {summaries[this.ID]['metadata']['interviewer'].length === 1 ?
                  <span>Apqaurta</span>
                  :
                  null
                }
                {summaries[this.ID]['metadata']['interviewer'].length === 2 ?
                  <span>Apqaurtek</span>
                  :
                  null
                }              
                {summaries[this.ID]['metadata']['interviewer'].length > 2 ?
                  <span>Apqaurtet</span>
                  :
                  null
                }
                <Popup hideOnScroll
                  trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                  on='click'
                  content={<div style={{fontSize:'16px'}}>{'Interviewer'}</div>}
                  position='bottom center'
                />
                <div style={{display:'flex',flexDirection:'column',fontSize:'17px',fontWeight:'300',paddingTop:'15px'}}>
                {summaries[this.ID]['metadata']['interviewer'].map((k)=>
                  <span style={{marginBottom:'4px'}}>{k}</span>
                )}
                </div>
              </div>
           </div>
  }
  parserPopup = () => {
    return (
      this.state.parses.length !== 0  ?
      <div>
        <div style={{fontSize:22}}>{this.state.segments[this.state.parseIndex].replace(/[<]/g,'·').replace(/[&↠↞]/g,'·')}</div>
        {this.state.yugtun[this.state.parseIndex].map((q,qindex) =>
          <div style={{paddingTop:15,paddingLeft:qindex*20,fontSize:'16px'}}>
              <div>
              <div style={{fontWeight:'bold',fontFamily:'Lato,Arial,Helvetica,sans-serif',paddingBottom:'5px'}}>
                {this.state.links[this.state.parseIndex][qindex] !== "" ?
                <a href={YUGTUNDOTCOM_URL+this.state.links[this.state.parseIndex][qindex]} target="_blank">
                {q}
                </a>
                :
                <span>
                {q}
                </span>
                }
              </div>                  
              {this.state.endingIndexes[this.state.parseIndex] === qindex ?
              this.state.english[this.state.parseIndex][qindex][0]
              :
              this.state.english[this.state.parseIndex][qindex]
              }
              </div>
          </div>
        )}

        <div style={{display:'flex',justifyContent:'center',marginTop:'12px'}}>
        <Icon disabled={this.state.parseIndex === 0} circular onClick={() => this.setState({parseIndex: this.state.parseIndex-1})} style={{margin:0,color:'#B1B1B1',cursor:'pointer',fontSize:'15px'}}  name='chevron left' />
        <Label basic circular style={{width:30,height:30,fontSize:14,}}>
          {this.state.parseIndex + 1}
        </Label>
        <Icon disabled={this.state.parseIndex === this.state.yugtun.length-1} circular onClick={() => this.setState({parseIndex: this.state.parseIndex+1})} style={{margin:0,color:'#B1B1B1',cursor:'pointer',fontSize:'15px'}}  name='chevron right' />
        </div>        

      </div>
      :
      <div style={{fontSize:'16px'}}>{'No Results'}</div>
    )
  }

  render() {
    // console.log(this.rep)
    // console.log(this.rep)
    // console.log(window.innerWidth-100)
    // var audio = document.getElementById("hello");
    // if (this.rap !== undefined) {
    //   if (!this.rap.audio.current.paused) {
    //     setInterval(()=>{console.log(this.rap.audio.current.currentTime);}, 5000);
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
    // let readerHeight = 0
    // if (this.videoPlayer) {
    //   readerHeight = this.videoPlayer.clientHeight
    // }
    // let audioHeight = 88+14
    // let topOffset = this.state.topOffset
    // let topOffsetAudio = 267

    // var readerElementWidth = 0

    // if (document.getElementById('readerelement')) {
    //   readerElementWidth = document.getElementById('readerelement').offsetWidth
    // }


    return (
      <div>

      {this.state.differentStartIndex !== -1 && this.state.showDifferentStartTimePopup?
    <Modal
      basic
      onClose={() => {this.setState({showDifferentStartTimePopup:false})}}
      open={this.state.showDifferentStartTimePopup}
      size='small'
      trigger={<span />}
    >
      <Header icon>
        Start the video here? 
      </Header>
      <Modal.Content style={{textAlign:'center',fontSize:'16px'}}>
        <div>
        {this.state.subtitles[this.state.differentStartIndex].transcript}
        </div>
        <div style={{fontStyle:'italic'}}>
        {this.state.subtitles[this.state.differentStartIndex].translation}
        </div>
        <div style={{marginTop:'10px'}}>
        {(Math.floor(this.state.subtitles[this.state.differentStartIndex].startTime/60)).toString()+'min '+(Math.floor(this.state.subtitles[this.state.differentStartIndex].startTime%60)).toString()+'sec'}
        </div>
      </Modal.Content>
      <Modal.Actions style={{textAlign:'center'}}>
        <Button basic color='red' inverted onClick={() => {this.setState({showDifferentStartTimePopup:false})}}>
          <Icon name='remove' /> Qang'a
        </Button>
        <Button color='green' inverted onClick={() => {this.setState({showDifferentStartTimePopup:false}); this.playSectionContinue(this.state.differentStartIndex);}}>
          <Icon name='checkmark' /> Ii-i
        </Button>
      </Modal.Actions>
    </Modal>
        :
        null
      }


      {this.props.innerWidth < 480 ?
    (this.props.audioOnly  ?
     <div>

      <div style={{flex:1,display:'flex',justifyContent:'center',marginBottom:'10px'}}>
      <span style={{fontSize:'16px',color:'grey',paddingRight:'15px',fontWeight:'400',lineHeight:'23px',paddingBottom:'4px',fontFamily:"'Roboto', Arial, Helvetica"}}>
        Erinairaqainaq
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{'Audio Only'}</div>}
                position='bottom right'
              />

      </span>
      <Checkbox toggle checked={this.props.audioOnly} onClick={this.props.audioHandler} />
      </div>

        <div class='reader' style={{paddingTop:'10px',position:'sticky', top:'0px',zIndex:1000}}>
          <AudioPlayer
            src={this.state.audioURL}
            controls
            // style={{position:'fixed','right':'3%','bottom':10,width:'94%',zIndex:10}}
            style={{width:'100%',zIndex:10}}
            ref={(element)=>{this.rap=element;}}
            onEnded={()=>{console.log('onEnded'); this.setState({audioPlayerPlaying:false}); this.resetTimer()}}
            onPlay={()=>{
              console.log('onPlay'); 
              this.setState({audioPlayerPlaying:true})
              // this.checkIfScrollNeeded()
          }}
            onPause={()=>{console.log('onPause'); this.setState({audioPlayerPlaying:false}); this.resetTimer()}}
          />
        </div>

              <div>
                <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> 
                  <span>Tegganret Qalartellret</span>
                  <Popup hideOnScroll
                    trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                    on='click'
                    content={<div style={{fontSize:'16px'}}>{'Elder Speakers'}</div>}
                    position='bottom center'
                  />
                </div>
                    
                <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
                  {this.state.elderTags.map((y) => (
                    y in categories ?
                    <div style={{display:'flex',flexDirection:'column',margin:'10px',width:'120px'}}>
                      <Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
                      <Image style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
                      {categories[y]['name'].includes('~') ?
                      <div>
                      <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
                      <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px'}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
                      </div>
                      :
                      <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px'}}>{categories[y]['name'].split('--')[0]}</div>
                      }
                      </Link>
                    </div>
                    :
                    null
                  ))}
                </div>
              </div>

              {this.tags()}

          {'interviewer' in summaries[this.ID]['metadata'] ?
            this.returnAqpaurtet()
            :
            null
          }

          {Object.keys(summaries[this.ID].summary).length !== 0 ?
            <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',paddingTop:'23px',paddingBottom:'15px'}}> 
            <span>Suuliarem Imai</span>
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{'Video Chapters'}</div>}
                position='bottom center'
              />
             </div>
            :
            null
          }

          {console.log(summaries[this.ID])}

          {Object.keys(summaries[this.ID].summary).map((y,yindex) => (
            <div class='reader' style={{fontSize:'17px',lineHeight:'24px'}}>

            {this.state.activeElementLocation === 'above' ?
              <span style={{top: this.state.mobileAudioOffset+30, position:'fixed',zIndex:1000,left:(this.props.innerWidth/2-25),}}><Icon style={{top:'15px', cursor:'pointer'}} size='large' color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron up' /></span>
                :
              null
            }
            
              {this.summaryTags(y,yindex)}
            </div>
          ))}
                    <div style={{textAlign:'center'}}>
                      <a href="https://docs.google.com/forms/d/e/1FAIpQLSeZDEwbmwVyfEawQe3T5wADEQpeMgWKdIsuQY-TPtEk2dVHaQ/viewform?usp=sf_link" target="_blank">
                        <div style={{cursor:'pointer',paddingTop:'10px'}}>
                        <Icon style={{color:'#a9a9a9',}} name='exclamation circle' />
                        <span style={{fontSize:'15px',color:'#9d9d9d',fontWeight:'400',lineHeight:'23px'}}>Report an Issue</span>
                        </div>
                      </a>
                    </div>


        <div class='reader'>
        {Object.keys(this.state.subtitles).map((i, index) => (
          <span class='reader-text'>

              {i in summaries[this.ID].summary ?
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',margin:'20px',fontSize:'21px',fontWeight:'bold',lineHeight:'28px',paddingTop:'5px'}}>

              {summaries[this.ID].summary[i][1].split(" ").map((k,kindex) => (
                <Popup hideOnScroll
                  trigger={<span style={{cursor:'pointer',color:(kindex === this.state.clickedChapterIndex[0] && index === this.state.clickedChapterIndex[1] ? '#78b7d6' : 'black' )}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,english:[],clickedChapterIndex:[kindex,index]},()=>{this.getParse(k.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());});
                    }
                  }
                  }>{k+'\xa0'}</span>}
                  disabled={this.state.getCall && kindex !== this.state.clickedChapterIndex[0]}
                  onClose={()=>this.setState({
                    clickedChapterIndex:[-1,-1],
                    yugtun: [],
                    english: [],
                    parses: [],
                    segments: [],
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    this.parserPopup()
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
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{summaries[this.ID].summary[i][2]}</div>}
                position='bottom left'
              />


                </div>
                :
                null
              }



            <Icon name='play circle' style={{color:'#d4d4d4'}} link onClick={() => {
              // this.rap.audio.current.pause();
              // this.setState({audioPlayerPlaying:false});
              // this.setState({currentSection:null},()=>{
                
                this.playSection(i);                
              // })
              // this.resetTimer()

            }} />

          <span id={'sentence'+i} style={{color:(i === this.state.currentSection || (this.state.currentSection === null &&this.state.audioPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ), borderBottom:(i === this.state.currentSection ? '5px solid #bee0f1' : '' )}}>
          {this.state.subtitles[i].transcript.split(' ').map((j,jindex) => (
            <Popup hideOnScroll
              trigger={<span style={{cursor:'pointer',color:(index === this.state.clickedWordIndex[0] && jindex === this.state.clickedWordIndex[1] ? '#78b7d6' :(i === this.state.currentSection || (this.state.currentSection === null &&this.state.audioPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ))}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,english:[],clickedWordIndex:[index,jindex]},()=>{this.getParse(j.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());});
                    }
                  }
                  }>{j+'\n'}</span>}
                  disabled={this.state.getCall && jindex !== this.state.clickedWordIndex[1]}
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
                this.parserPopup()
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
          <Popup hideOnScroll
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



      {this.state.activeElementLocation === 'below' ?
        <span style={{position:'sticky',fontSize:'17px', bottom:'25px', left:(this.props.innerWidth/2-25), zIndex:1000}}><Icon style={{cursor:'pointer'}} size='large' color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron down' /></span>
        :
        null
      }
 
      </div>

:

     <div className='about'>

      <div style={{flex:1,display:'flex',justifyContent:'center',marginBottom:'10px'}}>
      <span style={{fontSize:'16px',color:'grey',paddingRight:'15px',fontWeight:'400',lineHeight:'23px',paddingBottom:'4px',fontFamily:"'Roboto', Arial, Helvetica"}}>
      Erinairaqainaq
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{'Audio Only'}</div>}
                position='bottom right'
              />
      </span>
      <Checkbox toggle checked={this.props.audioOnly} onClick={this.props.audioHandler} />
      </div>

          <div class='reader' ref={(element)=>{this.videoPlayer=element;}} style={{paddingTop:'10px',position:'sticky', top:'0px',zIndex:1000}}>
            <div className='player-wrapper'>
            <ReactPlayer 
              className='react-player'
              controls
              url={this.state.videoURL} 
              ref={(element)=>{this.rep=element;}}
              width='100%'
              height='100%'
              playIcon
              onEnded={()=>{console.log('ended'); this.setState({videoPlayerPlaying:false}); this.resetTimer()}}
              onPlay={()=>{
                this.setState({videoPlayerPlaying:true})
                // this.checkIfScrollNeeded()
              }}
              onPause={()=>{this.setState({videoPlayerPlaying:false}); this.resetTimer()}}
            />
            </div>
          </div>

              <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> 
                <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> 
                  <span>Tegganret Qalartellret</span>
                  <Popup hideOnScroll
                    trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                    on='click'
                    content={<div style={{fontSize:'16px'}}>{'Elder Speakers'}</div>}
                    position='bottom center'
                  />
                </div>
              </div>
                
              <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
                {this.state.elderTags.map((y) => (
                  y in categories ?
                  <div style={{display:'flex',flexDirection:'column',margin:'10px',width:'120px'}}>
                    <Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
                    <Image style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
                    {categories[y]['name'].includes('~') ?
                    <div>
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px'}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
                    </div>
                    :
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px'}}>{categories[y]['name'].split('--')[0]}</div>
                    }
                    </Link>
                  </div>
                  :
                  null
                ))}
              </div>

              {this.tags()}

          {'interviewer' in summaries[this.ID]['metadata'] ?
            this.returnAqpaurtet()
            :
            null
          }

          {Object.keys(summaries[this.ID].summary).length !== 0 ?
            <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',paddingTop:'23px',paddingBottom:'15px'}}> 
            <span>Suuliarem Imai</span>
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{'Video Chapters'}</div>}
                position='bottom center'
              />
             </div>
            :
            null
          }

          {console.log(summaries[this.ID])}


          {Object.keys(summaries[this.ID].summary).map((y,yindex) => (
            <div class='reader' style={{fontSize:'17px',lineHeight:'24px'}}>

            {this.state.activeElementLocation === 'above' ?
              <span style={{top:this.state.videoHeight+10, position:'fixed',zIndex:1000,left:(this.props.innerWidth/2-25),}}><Icon style={{top:'15px', cursor:'pointer'}} size='large' color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron up' /></span>
                :
              null
            }
            
              {this.summaryTags(y,yindex)}
            </div>
          ))}        
                    <div style={{textAlign:'center'}}>
                      <a href="https://docs.google.com/forms/d/e/1FAIpQLSeZDEwbmwVyfEawQe3T5wADEQpeMgWKdIsuQY-TPtEk2dVHaQ/viewform?usp=sf_link" target="_blank">
                        <div style={{cursor:'pointer',paddingTop:'10px'}}>
                        <Icon style={{color:'#a9a9a9',}} name='exclamation circle' />
                        <span style={{fontSize:'15px',color:'#9d9d9d',fontWeight:'400',lineHeight:'23px'}}>Report an Issue</span>
                        </div>
                      </a>
                    </div>


        <div class='reader'>
        {Object.keys(this.state.subtitles).map((i, index) => (
          <span class='reader-text'>

              {i in summaries[this.ID].summary ?
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',margin:'20px',fontSize:'21px',fontWeight:'bold',lineHeight:'28px',paddingTop:'5px'}}>

              {summaries[this.ID].summary[i][1].split(" ").map((k,kindex) => (
                <Popup hideOnScroll
                  trigger={<span style={{cursor:'pointer',color:(kindex === this.state.clickedChapterIndex[0] && index === this.state.clickedChapterIndex[1] ? '#78b7d6' : 'black' )}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,english:[],clickedChapterIndex:[kindex,index]},()=>{this.getParse(k.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());});
                    }
                  }
                  }>{k+'\xa0'}</span>}
                  disabled={this.state.getCall && kindex !== this.state.clickedChapterIndex[0]}
                  onClose={()=>this.setState({
                    clickedChapterIndex:[-1,-1],
                    yugtun: [],
                    english: [],
                    parses: [],
                    segments: [],
                    endingIndexes: [],
                    links: [],
                    parseIndex: 0,
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    this.parserPopup()
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
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{summaries[this.ID].summary[i][2]}</div>}
                position='bottom left'
              />


                </div>
                :
                null
              }


            <Icon name='play circle' style={{color:'#d4d4d4'}} link onClick={() => {
              // this.setState({videoPlayerPlaying:false, currentSection: null,},()=>{
                // this.setState({currentSection:null})
                this.playSection(i);
              // });
            }} />

          <span id={'sentence'+i} style={{color:(i === this.state.currentSection || (this.state.currentSection === null &&this.state.videoPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ), borderBottom:(i === this.state.currentSection ? '5px solid #bee0f1' : '' )}}>
          {this.state.subtitles[i].transcript.split(' ').map((j,jindex) => (
            <Popup hideOnScroll
              trigger={<span style={{cursor:'pointer',color:(index === this.state.clickedWordIndex[0] && jindex === this.state.clickedWordIndex[1] ? '#78b7d6' :(i === this.state.currentSection || (this.state.currentSection === null &&this.state.videoPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ))}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,english:[],clickedWordIndex:[index,jindex]},()=>{this.getParse(j.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());});
                    }
                  }
                  }>{j+'\n'}</span>}
                  disabled={this.state.getCall && jindex !== this.state.clickedWordIndex[1]}
              onClose={()=>this.setState({
                clickedWordIndex:[-1,-1],
                    yugtun: [],
                    english: [],
                    parses: [],
                    segments: [],
                    endingIndexes: [],
                    links: [],
                    parseIndex: 0,
                // endingrule: [],
                // getCall:false,
              })}
              on='click'
              content={
                !this.state.getCall ? 
                this.parserPopup()
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
          <Popup hideOnScroll
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



      {this.state.activeElementLocation === 'below' ?
        <span style={{position:'sticky',fontSize:'17px', bottom:'25px', left:(this.props.innerWidth/2-25), zIndex:1000}}><Icon style={{cursor:'pointer'}} size='large' color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron down' /></span>
        :
        null
      }
 
      </div>


)


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
              onEnded={()=>{console.log('ended'); this.setState({audioPlayerPlaying:false}); this.resetTimer()}}
              onPlay={()=>{
                this.setState({audioPlayerPlaying:true})
              }}
              onPause={()=>{this.setState({audioPlayerPlaying:false}); this.resetTimer()}}
            />
            <Segment vertical style={{fontSize:22,marginTop:14,padding:0,maxHeight:this.props.innerHeight-this.state.topOffset-101 ,overflow: 'auto',borderBottom:'#f6f6f6 1px solid',borderTop:'#f6f6f6 1px solid'}}>



              <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}>
                <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> 
                  <span>Tegganret Qalartellret</span>
                  <Popup hideOnScroll
                    trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                    on='click'
                    content={<div style={{fontSize:'16px'}}>{'Elder Speakers'}</div>}
                    position='bottom center'
                  />
                </div>
              </div>
                
              <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
                {this.state.elderTags.map((y) => (
                  y in categories ?
                  <div style={{display:'flex',flexDirection:'column',margin:'10px',width:'120px'}}>
                    <Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
                    <Image style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
                    {categories[y]['name'].includes('~') ?
                    <div>
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px'}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
                    </div>
                    :
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px'}}>{categories[y]['name'].split('--')[0]}</div>
                    }
                    </Link>
                  </div>
                  :
                  null
                ))}
              </div>

              {this.tags()}

          {'interviewer' in summaries[this.ID]['metadata'] ?
            this.returnAqpaurtet()
            :
            null
          }

          {Object.keys(summaries[this.ID].summary).length !== 0 ?
            <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',paddingTop:'23px',paddingBottom:'15px'}}> 
            <span>Suuliarem Imai</span>
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{'Video Chapters'}</div>}
                position='bottom center'
              />
             </div>
            :
            null
          }


          {Object.keys(summaries[this.ID].summary).map((y,yindex) => (
            <div class='reader' style={{fontSize:'17px',lineHeight:'24px'}}>
              {this.summaryTags(y,yindex)}
            </div>
          ))}
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                      <a href="https://docs.google.com/forms/d/e/1FAIpQLSeZDEwbmwVyfEawQe3T5wADEQpeMgWKdIsuQY-TPtEk2dVHaQ/viewform?usp=sf_link" target="_blank">
                        <div style={{cursor:'pointer',paddingBottom:'5px'}}>
                        <Icon style={{color:'#a9a9a9',fontSize:'17px'}} name='exclamation circle' />
                        <span style={{fontSize:'14px',color:'#9d9d9d',fontWeight:'400',lineHeight:'23px'}}>Report an Issue</span>
                        </div>
                      </a>
                    </div>


            </Segment>




        </Grid.Column>
        <Grid.Column width={9}>
          <Segment  onScroll={this.handleScroll} vertical id='readerelement' style={{padding:0,maxHeight:this.props.innerHeight-this.state.topOffset,overflow: 'auto',borderBottom:'#f6f6f6 1px solid',borderTop:'#f6f6f6 1px solid'}}>
            

            {this.state.activeElementLocation === 'above' ?
              <span style={{position:'fixed',zIndex:1000,right:(this.state.readerElementWidth/2),}}><Icon style={{top:'15px', cursor:'pointer'}} size='large' color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron up' /></span>
              :
              null
            }

            {Object.keys(this.state.subtitles).map((i, index) => (
              <span class='reader-text'>

              {i in summaries[this.ID].summary ?
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',margin:'20px',fontSize:'22px',fontWeight:'bold',lineHeight:'28px',paddingTop:'5px'}}>

              {summaries[this.ID].summary[i][1].split(" ").map((k,kindex) => (
                <Popup hideOnScroll
                  trigger={<span style={{cursor:'pointer',color:(kindex === this.state.clickedChapterIndex[0] && index === this.state.clickedChapterIndex[1] ? '#78b7d6' : 'black' )}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,english:[],clickedChapterIndex:[kindex,index]},()=>{this.getParse(k.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());});
                    }
                  }
                  }>{k+'\xa0'}</span>}
                  disabled={this.state.getCall && kindex !== this.state.clickedChapterIndex[0]}
                  onClose={()=>this.setState({
                    clickedChapterIndex:[-1,-1],
                    yugtun: [],
                    english: [],
                    parses: [],
                    segments: [],
                    endingIndexes: [],
                    links: [],
                    parseIndex: 0,
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    this.parserPopup()
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
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{summaries[this.ID].summary[i][2]}</div>}
                position='bottom left'
              />


                </div>
                :
                null
              }

              <Icon name='play circle' style={{color:'#d4d4d4'}} link onClick={() => {
                // this.setState({audioPlayerPlaying:false},()=>{
                // this.rap.audio.current.pause();
                this.playSection(i);

                // });
              }} />
              <span id={'sentence'+i} style={{color:(i === this.state.currentSection || (this.state.currentSection === null && this.state.audioPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ), borderBottom:(i === this.state.currentSection ? '5px solid #bee0f1' : '' )}}>
              {this.state.subtitles[i].transcript.split(' ').map((j,jindex) => (
                <Popup hideOnScroll
                  trigger={<span style={{cursor:'pointer',color:(index === this.state.clickedWordIndex[0] && jindex === this.state.clickedWordIndex[1] ? '#78b7d6' :(i === this.state.currentSection || (this.state.currentSection === null && this.state.audioPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ))}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,english:[],clickedWordIndex:[index,jindex]},()=>{this.getParse(j.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());});
                    }
                  }
                  }>{j+'\n'}</span>}
                  disabled={this.state.getCall && jindex !== this.state.clickedWordIndex[1]}
                  onClose={()=>this.setState({
                    clickedWordIndex:[-1,-1],
                    yugtun: [],
                    english: [],
                    parses: [],
                    segments: [],
                    endingIndexes: [],
                    links: [],
                    parseIndex: 0,
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    this.parserPopup()
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
              <Popup hideOnScroll
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
              <span style={{position:'sticky', bottom:'15px', right:(this.state.readerElementWidth/2-30), zIndex:1000}}><Icon style={{cursor:'pointer'}} size='large' color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron down' /></span>
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
          <div class='reader' ref={(element)=>{this.videoPlayer=element;}}>
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
              onEnded={()=>{console.log('ended'); this.setState({videoPlayerPlaying:false}); this.resetTimer()}}
              onPlay={()=>{
                this.setState({videoPlayerPlaying:true})
                // this.checkIfScrollNeeded()
              }}
              onPause={()=>{this.setState({videoPlayerPlaying:false}); this.resetTimer()}}
            />
            </div>
          </div>

            <Segment vertical style={{fontSize:22,marginTop:14,padding:0,maxHeight:this.props.innerHeight-this.state.videoHeight-this.state.topOffset-13,overflow: 'auto',borderBottom:'#f6f6f6 1px solid',borderTop:'#f6f6f6 1px solid'}}>

              <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> 
                <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',lineHeight:'45px',paddingTop:'5px'}}> 
                  <span>Tegganret Qalartellret</span>
                  <Popup hideOnScroll
                    trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                    on='click'
                    content={<div style={{fontSize:'16px'}}>{'Elder Speakers'}</div>}
                    position='bottom center'
                  />
                </div>
              </div>
                
              <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
                {this.state.elderTags.map((y) => (
                  y in categories ?
                  <div style={{display:'flex',flexDirection:'column',margin:'10px',width:'120px'}}>
                    <Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
                    <Image style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
                    {categories[y]['name'].includes('~') ?
                    <div>
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px'}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
                    </div>
                    :
                    <div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontSize:'14px'}}>{categories[y]['name'].split('--')[0]}</div>
                    }
                    </Link>
                  </div>
                  :
                  null
                ))}
              </div>

              {this.tags()}


          {'interviewer' in summaries[this.ID]['metadata'] ?
            this.returnAqpaurtet()
            :
            null
          }


          {Object.keys(summaries[this.ID].summary).length !== 0 ?
            <div style={{textAlign:'center',fontSize:'20px',fontWeight:'bold',paddingTop:'23px',paddingBottom:'15px'}}> 
            <span>Suuliarem Imai</span>
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'5px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{'Video Chapters'}</div>}
                position='bottom center'
              />
             </div>
            :
            null
          }

          {console.log(summaries[this.ID])}
          {Object.keys(summaries[this.ID].summary).map((y,yindex) => (
            <div class='reader' style={{fontSize:'17px',lineHeight:'24px'}}>
              {this.summaryTags(y,yindex)}
            </div>
          ))}
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                      <a href="https://docs.google.com/forms/d/e/1FAIpQLSeZDEwbmwVyfEawQe3T5wADEQpeMgWKdIsuQY-TPtEk2dVHaQ/viewform?usp=sf_link" target="_blank">
                        <div style={{cursor:'pointer',paddingBottom:'5px'}}>
                        <Icon style={{color:'#a9a9a9',fontSize:'17px'}} name='exclamation circle' />
                        <span style={{fontSize:'14px',color:'#9d9d9d',fontWeight:'400'}}>Report an Issue</span>
                        </div>
                      </a>
                    </div>


            </Segment>




        </Grid.Column>
        <Grid.Column width={9}>
          <Segment onScroll={this.handleScroll} vertical id='readerelement' style={{padding:0,maxHeight:this.props.innerHeight-this.state.topOffset,overflow: 'auto',borderBottom:'#f6f6f6 1px solid',borderTop:'#f6f6f6 1px solid'}}>
            
            {this.state.activeElementLocation === 'above' ?
              <span style={{position:'fixed',zIndex:1000,right:(this.state.readerElementWidth/2),}}><Icon style={{top:'15px', cursor:'pointer'}} size='large' color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron up' /></span>
              :
              null
            }
            {Object.keys(this.state.subtitles).map((i, index) => (
              <span class='reader-text'>
              {i in summaries[this.ID].summary ?
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',margin:'20px',fontSize:'22px',fontWeight:'bold',lineHeight:'28px',paddingTop:'5px'}}>

              {summaries[this.ID].summary[i][1].split(" ").map((k,kindex) => (
                <Popup hideOnScroll
                  trigger={<span style={{cursor:'pointer',color:(kindex === this.state.clickedChapterIndex[0] && index === this.state.clickedChapterIndex[1] ? '#78b7d6' : 'black' )}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,english:[],clickedChapterIndex:[kindex,index]},()=>{this.getParse(k.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());});
                    }
                  }
                  }>{k+'\xa0'}</span>}
                  disabled={this.state.getCall && kindex !== this.state.clickedChapterIndex[0]}
                  onClose={()=>this.setState({
                    clickedChapterIndex:[-1,-1],
                    yugtun: [],
                    english: [],
                    parses: [],
                    segments: [],
                    endingIndexes: [],
                    links: [],
                    parseIndex: 0,
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    this.parserPopup()
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
              <Popup hideOnScroll
                trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{summaries[this.ID].summary[i][2]}</div>}
                position='bottom left'
              />


                </div>
                :
                null
              }

              <Icon name='play circle' style={{color:'#d4d4d4'}} link onClick={() => {
                // this.setState({videoPlayerPlaying:false, currentSection: null,})
                this.playSection(i)
                
              }} />
              <span id={'sentence'+i} style={{color:(i === this.state.currentSection || (this.state.currentSection === null && this.state.videoPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ), borderBottom:(i === this.state.currentSection ? '5px solid #bee0f1' : '' )}}>
              {this.state.subtitles[i].transcript.split(' ').map((j,jindex) => (
                <Popup hideOnScroll
                  trigger={<span style={{cursor:'pointer',color:(index === this.state.clickedWordIndex[0] && jindex === this.state.clickedWordIndex[1] ? '#78b7d6' :(i === this.state.currentSection || (this.state.currentSection === null &&this.state.videoPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ))}} onClick={() => {
                    if (!this.state.getCall) {
                      this.setState({getCall:true,english:[],clickedWordIndex:[index,jindex]},()=>{this.getParse(j.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());});
                    }
                  }
                  }>{j+'\n'}</span>}
                  disabled={this.state.getCall && jindex !== this.state.clickedWordIndex[1]}
                  onClose={()=>this.setState({
                    clickedWordIndex:[-1,-1],
                    yugtun: [],
                    english: [],
                    parses: [],
                    segments: [],
                    endingIndexes: [],
                    links: [],
                    parseIndex: 0,
                    // endingrule: [],
                    // getCall:false,
                  })}
                  on='click'
                  content={
                    !this.state.getCall ? 
                    this.parserPopup()
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
              <Popup hideOnScroll
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
              <span style={{position:'sticky', bottom:'15px', right:(this.state.readerElementWidth/2-30), zIndex:1000}}><Icon style={{cursor:'pointer'}} size='large' color='blue' onClick={()=>{document.getElementById('sentence'+(this.state.currentSentence)).scrollIntoView({behavior: "smooth", block: "center"}) }} inverted circular name='chevron down' /></span>
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
