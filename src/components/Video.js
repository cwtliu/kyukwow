import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Popup, Loader } from 'semantic-ui-react';
import ReactPlayer from 'react-player'
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import { API_URL } from '../App.js';
import {subtitles} from './transcription/cpb-aacip-127-00ns1t6z.h264.js';
import {scroller} from "react-scroll";

const endingToEnglishTerms = {
  "[Ind]":"Indicative (Statement Form)",
  "[Intrg]":"Interrogative (Question Form)",
  "[Opt]":"Optative (Command Form)",
  "[Sbrd]":"Subordinative (Polite Command or -ing Form)",
  "[Ptcp]":"Participial",
  "[Prec]":"Precessive (before...)",
  "[Cnsq]":"Consequential (because...)",
  "[Cont]":"Contigent (whenever...)",
  "[Conc]":"Concessive (although, even though, even if...)",
  "[Cond]":"Conditional (if, when in the future...)",
  "[CtmpI]":"Contemporative 1 (when in fthe past...)",
  "[CtmpII]":"Contemporative 2 (while...)",
  "[Abs]":"Absolutive",
  "[Rel]":"Relative",
  "[Abl_Mod]":"Ablative-Modalis (indirect object, from...)",
  "[Loc]":"Localis (in, at...)",
  "[Ter]":"Terminalis (toward...)",
  "[Via]":"Vialis (through, using...)",
  "[Equ]":"Equalis (like, similar to...)",
  "[Quant_Qual]":"Quantifier/Qualifier Inflection",
  "[S_3Sg]":"he,\xa0she,\xa0it",
  "[S_3Du]":"they\xa0(2)",
  "[S_3Pl]":"they\xa0all\xa0(3+)",
  "[S_1Sg]":"I",
  "[S_1Du]":"we\xa0(2)",
  "[S_1Pl]":"we\xa0all\xa0(3+)",
  "[S_2Sg]":"you",
  "[S_2Du]":"you\xa0(2)",
  "[S_2Pl]":"you\xa0all\xa0(3+)",
  "[S_4Sg]":"he, she, it (itself)",
  "[S_4Du]":"they (2) (themselves)",
  "[S_4Pl]":"they all (3+) (themselves)",
  "[A_3Sg]":"he,\xa0she,\xa0it",
  "[A_3Du]":"they\xa0(2)",
  "[A_3Pl]":"they\xa0all\xa0(3+)",
  "[A_1Sg]":"I",
  "[A_1Du]":"we\xa0(2)",
  "[A_1Pl]":"we\xa0all\xa0(3+)",
  "[A_2Sg]":"you",
  "[A_2Du]":"you\xa0(2)",
  "[A_2Pl]":"you\xa0all\xa0(3+)",
  "[A_4Sg]":"he, she, it (itself)",
  "[A_4Du]":"they (2) (themselves)",
  "[A_4Pl]":"they all (3+) (themselves)",
//   "[P_3Sg]":"her,\xa0him,\xa0it\xa0(other)",
//   "[P_3Du]":"the\xa0two\xa0of\xa0them\xa0(others)",
//   "[P_3Pl]":"them\xa0all\xa0(3+)\xa0(others)",
  "[P_3Sg]":"another",
  "[P_3Du]":"two others",
  "[P_3Pl]":"3+ others",
  "[P_1Sg]":"me",
  "[P_1Du]":"the\xa0two\xa0of\xa0us",
  "[P_1Pl]":"us\xa0all\xa0(3+)",
  "[P_2Sg]":"you",
  "[P_2Du]":"the\xa0two\xa0of\xa0you",
  "[P_2Pl]":"you\xa0all\xa0(3+)",
  "[P_4Sg]":"her,\xa0him,\xa0it\xa0(itself)",
  "[P_4Du]":"the\xa0two\xa0of\xa0them\xa0(themselves)",
  "[P_4Pl]":"them\xa0all\xa0(3+)\xa0(themselves)",
  "[SgUnpd]":"the one",
  "[DuUnpd]":"the two",
  "[PlUnpd]":"the 3+",
  "[SgPosd]":"one",
  "[DuPosd]":"two",
  "[PlPosd]":"three or more",
  "[3SgPoss]":"his/her/its\xa0(other)",
  "[3DuPoss]":"their\xa0(2)\xa0(other)",
  "[3PlPoss]":"their\xa0(3+)\xa0(other)",
  "[1SgPoss]":"my",
  "[1DuPoss]":"our\xa0(2)",
  "[1PlPoss]":"our\xa0(3+)",
  "[2SgPoss]":"your\xa0(1)",
  "[2DuPoss]":"your\xa0(2)",
  "[2PlPoss]":"your\xa0(3+)",
  "[4SgPoss]":"his/her/its\xa0own",
  "[4DuPoss]":"their\xa0own\xa0(2)",
  "[4PlPoss]":"their\xa0own\xa0(3+)",
  "[3Sg]":"it\xa0(other)",
  "[3Du]":"them\xa0(2)\xa0(other)",
  "[3Pl]":"them\xa0(3+)\xa0(other)",
  "[1Sg]":"me",
  "[1Du]":"us\xa0(2)",
  "[1Pl]":"us\xa0(3+)",
  "[2Sg]":"you\xa0(1)",
  "[2Du]":"you\xa0(2)",
  "[2Pl]":"you\xa0(3+)",
  "[4Sg]":"itself",
  "[4Du]":"themselves\xa0(2)",
  "[4Pl]":"themselves\xa0(3+)",
};

const endingEnglishDescriptions = {
  "[Ind]":"(is, are, am)",
  "[Intrg]":"(question)",
  "[Opt]":"(do it!)",
  "[Sbrd]":"(please do, being)",
  "[Ptcp]":"(the one being, special case)",
  "[Prec]":"(before)",
  "[Cnsq]":"(because)",
  "[Cont]":"(whenever)",
  "[Conc]":"(although, even if)",
  "[Cond]":"(if, when in future)",
  "[CtmpI]":"(when in past)",
  "[CtmpII]":"(while)",
  "[Abs]":"the",
  "[Rel]":"the",
  "[Abl_Mod]":"[a, some, from]",
  "[Loc]":"in or at",
  "[Ter]":"toward",
  "[Via]":"through or using",
  "[Equ]":"like or similar to",
  "[Quant_Qual]":"Quantifier/Qualifier Inflection",
}


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
      currentSentence: 1,
      nextSentenceStart: subtitles[2].startTime,
      currentTime:0,
      previousSentenceEnd:-1,
    }
    this.audio = new Audio(this.state.audioURL);
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      500
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    if (this.rap !== null) {
      this.setState({
        currentTime : this.rap.audioEl.current.currentTime,
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
      while (current+1+i !== Object.keys(subtitles).length+1 && subtitles[current+1+i].startTime < this.state.currentTime) {
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

      if (current+1+i === Object.keys(subtitles).length+1) {
        this.setState({
          currentSentence: current+i,
          nextSentenceStart: this.rap.audioEl.current.duration,
          previousSentenceEnd: subtitles[current-1+i].endTime,
        });
      } else {
        this.setState({
          currentSentence: current+i,
          nextSentenceStart: subtitles[current+1+i].startTime,
          previousSentenceEnd: subtitles[current-1+i].endTime,
        });        
      }
    }


    if (this.state.previousSentenceEnd > this.state.currentTime) {
      let current = this.state.currentSentence;
      let i = 0;
      while (current-1+i !== 0 && subtitles[current-1+i].endTime > this.state.currentTime) {
        i=i-1;
      }

      if (i < -1) {
        var elmnt = document.getElementById('sentence'+(current+i));
        elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
      }


        this.setState({
          currentSentence: current+i,
          nextSentenceStart: subtitles[current+1+i].startTime,
        });        

      if (current-1+i === 0) {
        this.setState({
          previousSentenceEnd: 0,
        });
      } else {
        this.setState({
          previousSentenceEnd: subtitles[current-1+i].endTime,
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
    //     //     nextSentenceStart: subtitles[this.state.currentSentence+2].startTime,
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
    this.setState({
      endTime: subtitles[i].endTime,
      currentSection: i,
    });
    this.audio.currentTime = subtitles[i].startTime;
    this.audio.play();
    const timer = setTimeout(() => {
      this.audio.pause();
      this.setState({
        startTime: null,
        endTime: null,
        currentSection: null,
      });

    }, (subtitles[i].endTime-subtitles[i].startTime)*1000+1000); // added a second trailing
    // clearTimeout(timer);
  };



  render() {
    console.log(this.state)
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
          style={{position:'fixed','bottom':10,width:'100%'}}
          ref={(element)=>{this.rap=element;}}
          onPlay={()=>{
            this.setState({audioPlayerPlaying:true})
            var elmnt = document.getElementById('sentence'+(this.state.currentSentence));
            elmnt.scrollIntoView({behavior: "smooth", block: "center"}); 
        }}
          onPause={()=>{this.setState({audioPlayerPlaying:false})}}
        />
        <div class='reader'>
        <div style={{textAlign:'center',fontSize:'30px',fontWeight:'bold',lineHeight:'45px'}}> Reader </div>
        {Object.keys(subtitles).map((i, index) => (
          <span style={{fontSize:'25px',lineHeight:'45px'}}>
          <Icon name='play circle' style={{color:'#d4d4d4'}} onClick={() => {
            this.playSection(i);
            this.rap.audioEl.current.pause();
            this.setState({audioPlayerPlaying:false});
          }} />

          <span id={'sentence'+i}style={{color:(i === this.state.currentSection || (this.state.audioPlayerPlaying && index === this.state.currentSentence-1) ? '#31708F' : 'black' ), borderBottom:(i === this.state.currentSection ? '5px solid #bee0f1' : '' )}}>

          {subtitles[i].transcript.split(' ').map(j => (
            <Popup
              trigger={<span onClick={() => {
                this.getParse(j.split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase());
                this.setState({getCall:true});
              }
              }>{j+'\n'}</span>}
              on='click'
              onUnmount={()=>this.setState({
                definitions:[],
                parses: [],
                segments: [],
                endingrule: [],
                // getCall:false,
              })}
              content={
                !this.state.getCall ? 
                (
                this.state.parses.length !== 0 && this.state.segments.length !== 0 ?
                  <div>
                  <Icon name='window close outline' style={{position:'absolute',top:5,right:5,color:'grey',fontSize:'15px'}} />
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
            <p>{subtitles[i].translation}</p>
            :
            null
          }
          <Popup
            trigger={<Icon style={{paddingRight:'50px',color:'#d4d4d4'}} name='comment alternate outline' />}
            on='click'
            content={<div style={{fontSize:'16px'}}>{subtitles[i].translation}</div>}
            position='bottom left'
          />
          </span>
          )
        )}
      </div>

r
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

        <button onClick={()=> this.getParse("pissurtuq".split(" ")[0].replace(/[^a-zA-Z\-̄͡͞ńḿ']/g, "").toLowerCase())}>
        parse
        </button>
      </div>

      </div>
    );
  }
}
export default Video;
