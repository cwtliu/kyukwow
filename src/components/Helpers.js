import React from 'react';
import { Container, Divider, List, Label, Loader, Dimmer, Popup, Icon,Grid,Image,Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import {YouTubeLinks} from './info/YouTubeLinks.js';
import { API_URL, WEB_URL } from '../App.js';


  // export const summariesRetrieval = (props) => {
  //       return (<span> 
  //             <span style={{fontFamily:"'Roboto',Arial, Helvetica",fontSize:'14px'}}>{summaries[x].summary[index][1]}</span>
  //             <Popup
  //               trigger={<Icon style={{color:'#d4d4d4',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
  //               on='click'
  //               content={<div style={{fontSize:'16px'}}>{summaries[x].summary[index][2]}</div>}
  //               position='bottom left'
  //             />
  //             </span>
  //     )
  // }

  export const FeaturedVideos = (props) => {
    // console.log(props)
    var x = props.x
    var xind = props.xind
    var innerWidth = props.width
    var stringLengthCounter = 0
    var upToIndex = 0
    // console.log(Object.keys(summaries[x].summary).length)
    while (stringLengthCounter < 250 && upToIndex < Object.keys(summaries[x].summary).length) {
      stringLengthCounter += summaries[x].summary[Object.keys(summaries[x].summary)[upToIndex]][1].length
      upToIndex += 1
    }
    // console.log(stringLengthCounter,upToIndex)
    return (
       (innerWidth < 480 ?
        <Grid style={{marginTop:30,marginBottom:30}} container>
          <Grid.Row key={xind}>
            <Grid.Column style={{display:'flex',justifyContent:'center'}}>
              <Link style={{maxWidth:'240px'}} to={{pathname: '/video/'+x, state: { currentVideoId: x}}}>
                <Image style={{borderRadius:'10px'}} src={"https://img.youtube.com/vi/"+
                YouTubeLinks[x].split(".be/")[1]
                +"/hqdefault.jpg"} />
              </Link>         
            </Grid.Column>
          </Grid.Row>   
          <Grid.Row>
            <Grid.Column style={{padding:0,textAlign:'center'}}>
                <Link style={{display:'flex',justifyContent:'center',color:'black'}} to={{pathname: '/video/'+x, state: { currentVideoId: x}}}>
                  <div style={{fontSize:'16px',fontWeight:'600',paddingBottom:10}}>{summaries[x].title}</div>
                </Link>
                {Object.keys(summaries[x].summary).map((y,yindex) => 
                  {return (upToIndex > yindex ? <span> 
                        <span style={{fontFamily:"'Roboto',Arial, Helvetica",fontSize:'16px',lineHeight:'22px'}}>{summaries[x].summary[y][1]}</span>
                        <Popup
                          trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                          on='click'
                          content={<div style={{fontSize:'16px'}}>{summaries[x].summary[y][2]}</div>}
                          position='bottom left'
                        />
                        </span>
                        :
                        null)}
                 )}
                <div>
                {'. . .'}    
                </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{display:'flex',justifyContent:'center'}}>
          <div style={{maxWidth:700,textAlign:'center',lineHeight:'34px'}}>
          {summaries[x].tags.map((y)=>(
            y in categories ?
            <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
              <Button basic compact>
              {/*{categories[y].name.replaceAll('--','—')}*/}
              <span style={{fontSize:'16px'}}>
              {categories[y].name.split(' -- ')[0]}
              </span>
              </Button>
            </Link>
            :
            null
          ))}
          <Popup
            trigger={<Icon size='large' style={{color:'#d4d4d4',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
            on='click'
            content={summaries[x].tags.map((y)=><div style={{fontSize:'16px'}}>{y}</div>)}
            position='bottom left'
          />
          </div>
          </Grid.Row>
        </Grid>
        :
        <Grid style={{marginTop:30,marginBottom:30}} container>
          <Grid.Row columns={2} key={xind}>
            <Grid.Column style={{display:'flex',justifyContent:'flex-end'}} width={6}>
              <Link style={{maxWidth:'240px'}} to={{pathname: '/video/'+x, state: { currentVideoId: x}}}>
                <Image style={{borderRadius:'10px'}} src={"https://img.youtube.com/vi/"+
                YouTubeLinks[x].split(".be/")[1]
                +"/hqdefault.jpg"} />
              </Link>         
            </Grid.Column>
            <Grid.Column width={10}>
              <div style={{maxWidth:450}}>
                <Link style={{color:'black'}} to={{pathname: '/video/'+x, state: { currentVideoId: x}}}>
                  <div style={{fontSize:'16px',fontWeight:'600',paddingBottom:10}}>{summaries[x].title}</div>
                </Link>
                {Object.keys(summaries[x].summary).map((y,yindex) =>
                  {return (upToIndex > yindex ? <span> 
                        <span style={{fontFamily:"'Roboto',Arial, Helvetica",fontSize:'16px',lineHeight:'22px'}}>{summaries[x].summary[y][1]}</span>
                        <Popup
                          trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                          on='click'
                          content={<div style={{fontSize:'16px'}}>{summaries[x].summary[y][2]}</div>}
                          position='bottom left'
                        />
                        </span>
                        :
                        null)}
                 )}
                {'. . .'}    
              </div>
            </Grid.Column>
          </Grid.Row>   
          <Grid.Row style={{display:'flex',justifyContent:'center'}}>
          <div style={{maxWidth:700,textAlign:'center',lineHeight:'34px'}}>
          {summaries[x].tags.map((y)=>(
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
            content={summaries[x].tags.map((y,yindex)=><div style={{display:'flex',fontSize:'14px',paddingTop:(yindex !== 0 ? '3px' : ''),marginTop:(yindex !== 0 ? '4px' : ''),borderTop:(yindex !== 0 ? '1px solid #f4f3f3' : '')}}><span style={{flex:1,color:'#00000099'}}>{categories[y].name.split('--')[0]}</span><span style={{flex:1,display:'flex',alignItems:'center',marginLeft:'5px'}}><span>{categories[y].name.split('--')[1]}</span></span></div>)}
            position='bottom left'
          />

          </div>
          </Grid.Row>
        </Grid>
      )
    )
  }




// export const YugtunLoader = (props) => (
//   <Dimmer active={props.criteria}>
//     <Loader size='massive'>
//       Iñupiaq is loading...
//     </Loader>
//   </Dimmer>
// );

// // let customFontFam = "Roboto,'Helvetica Neue',Arial,Helvetica,sans-serif"


// export const TagColors = (props) => {
//   // let isParticle = props.tags.includes('particle');
//   // let isExclamation = props.tags.includes('exclamation');
//   // let isConjunction = props.tags.includes('conjunction');
//   // let isAdverb = props.tags.includes('adverb');
//   // let isPredicate = props.tags.includes('predicate');
//   // let isDemonstrative = props.tags.includes('demonstrative');
//   // let isInterjection = props.tags.includes('interjection');
//   // let isPostbase = props.tags.includes('postbase');
//   // let isEnclitic = props.tags.includes('enclitic');

//   let upperCase = props.tags
//   let width = props.width

//   // if (upperCase.length > 0) {
//   //   if (upperCase[0] == '!') {
//   //     upperCase = upperCase.slice(1)
//   //   }
//   // }
//   // console.log(props)
//   let english = upperCase
//   if (width < 480) {
//     if (width === -1) {
//       upperCase = upperCase.replace('verb stem','Suraġaġniġum Maŋŋua')
//       upperCase = upperCase.replace('noun','Atiqausiq')
//       upperCase = upperCase.replace('NOUN','Atiqausiq')   
//       upperCase = upperCase.replace('(i) INTRANSITIVE VERB','Nalunaiŋaruq Suraġaqti')
//       upperCase = upperCase.replace('(t) TRANSITIVE VERB','Nalunaiŋaruk Suraġaqtilu Suraġaqtaġlu')
//     } else {
//       upperCase = upperCase.replace('noun','Atiqa...')
//       upperCase = upperCase.replace('NOUN','Atiqa...')
//       upperCase = upperCase.replace('verb stem','Suraġ...')
//       upperCase = upperCase.replace('(i) INTRANSITIVE VERB','Nalunaiŋaruq...')
//       upperCase = upperCase.replace('(t) TRANSITIVE VERB','Nalunaiŋaruk...')
//     }
//   } else {
//   upperCase = upperCase.replace('verb stem','Suraġaġniq...')
//   upperCase = upperCase.replace('noun','Atiqausiq')
//   upperCase = upperCase.replace('NOUN','Atiqausiq')    
//   upperCase = upperCase.replace('(i) INTRANSITIVE VERB','Nalunaiŋaruq Suraġaqti')
//   upperCase = upperCase.replace('(t) TRANSITIVE VERB','Nalunaiŋaruk Suraġaqtilu Suraġaqtaġlu')

//   }
//   upperCase = upperCase.replace('verb phrase','suraġaġniq')
//   if (upperCase == 'VERB') {
//   upperCase = upperCase.replace('VERB','suraġaġniq')    
//   }
//   upperCase = upperCase.toUpperCase()

//   english = english.replace('(i) INTRANSITIVE VERB','Nalunaiŋaruq Suraġaqti - "Subject is Marked" - (i) Intransitive Verb - Ending with Subject Only')
//   english = english.replace('(t) TRANSITIVE VERB','Nalunaiŋaruk Suraġaqtilu Suraġaqtaġlu - "Subject And Object Are Marked" - (t) Transitive Verb - Ending with Subject and Direct Object')


//   // upperCase = upperCase.replace('verb stem','V')
//   // upperCase = upperCase.replace('verb phrase','V')
//   // upperCase = upperCase.replace('noun','N')
//   // upperCase = upperCase.replace('NOUN','N')
//   // upperCase = upperCase.replace('(i) INTRANSITIVE VERB','IV')
//   // upperCase = upperCase.replace('(t) TRANSITIVE VERB','TV')
//   // upperCase = upperCase.replace('VERB','V')
//   // upperCase = upperCase.toUpperCase()

//   english = english.replace('noun','Atiqausiq - Noun')
//   english = english.replace('NOUN','Atiqausiq - Noun')

//   english = english.replace('VERB','Suraġaġniġum Maŋŋua - Verb Stem')
//   english = english.replace('verb stem','Suraġaġniġum Maŋŋua - Verb Stem')
//   english = english.replace('verb phrase','Suraġaġniq - Verb Phrase')
//   // english = english.replace('(i) INTRANSITIVE VERB','"Subject is Marked" - Intransitive Verb - Ending with Subject Only')
//   // english = english.replace('(t) TRANSITIVE VERB','"Subject And Object Are Marked" - Transitive Verb - Ending with Subject and Direct Object')

//   // english = english.toUpperCase()

//   if (props.tags == 'noun') {
//     return <Popup position='bottom center' on='click' content={english} trigger={<Label size='mini' style={{backgroundColor:'#f6ede4',marginTop:'5px'}}>{upperCase}<Icon style={{fontSize:'9px',margin:0,padding:0,marginLeft:'6px'}} name='chevron down' /></Label>} />
//   } else if (props.tags == 'NOUN') {
//     return <Popup position='bottom center' on='click' content={english} trigger={<Label size='mini' style={{backgroundColor:'#f1f1f1',marginTop:'5px'}}>{upperCase}<Icon style={{fontSize:'9px',margin:0,padding:0,marginLeft:'6px'}} name='chevron down' /></Label>} />
//   } else if (props.tags == 'verb stem' || props.tags == 'verb phrase') {
//     return <Popup position='bottom center' on='click' content={english} trigger={<Label size='mini' style={{backgroundColor:'#e2eeea',marginTop:'5px'}}>{upperCase}<Icon style={{fontSize:'9px',margin:0,padding:0,marginLeft:'6px'}} name='chevron down' /></Label>} />
//   } else if (props.tags == '(i) INTRANSITIVE VERB' || props.tags == '(t) TRANSITIVE VERB' || props.tags == 'VERB') {
//     return <Popup position='bottom center' on='click' content={english} trigger={<Label size='mini' style={{backgroundColor:'#f1f1f1',marginTop:'5px'}}>{upperCase}<Icon style={{fontSize:'9px',margin:0,padding:0,marginLeft:'6px'}} name='chevron down' /></Label>} />
//   } else if (props.tags == 'postbase') {
//     return <Label size='mini' style={{backgroundColor:'#f7e7fa',marginTop:'5px'}}>{upperCase}</Label>
//   } else if (props.tags == 'root' || props.tags == 'deep root' || props.tags == 'stem' || props.tags == 'interrogative stem') {
//     return <Label size='mini' style={{backgroundColor:'#ecd8d8',marginTop:'5px'}}>{upperCase}</Label>
//   } else if (props.tags == 'Grammar Year 1') {
//     return null
//   } else {
//     return <Label basic size='mini' style={{color:'#5f5f5f',marginTop:'5px'}}>{upperCase}</Label>
//   }


//   // return (
//   //     <span style={{ 'marginLeft': '15px'}}>  
//   //     if (props.tags == 'noun') {return (<Label size='mini' style={{backgroundColor:'#7F90B0',color:'white'}}>NOUN</Label>)}
//   //       {isVerb ? <Label size='mini' style={{backgroundColor:'#B07F7F',color:'white'}}>VERB STEM</Label> : ''}
//   //       {isRoot ? <Label size='mini' style={{backgroundColor:'#88b58d',color:'white'}}>ROOT</Label> : ''}
//   //       {isDeepRoot ? <Label size='mini' style={{backgroundColor:'#88b58d',color:'white'}}>DEEP ROOT</Label> : ''}
//   //       {isStem ? <Label size='mini' style={{backgroundColor:'#88b58d',color:'white'}}>STEM</Label> : ''}
//   //       {isInterrogativeStem ? <Label size='mini' style={{backgroundColor:'#88b58d',color:'white'}}>INTERROGATIVE STEM</Label> : ''}

//   //     </span>
//   //   )
// }


// export const WordItem = (props) => {
//   console.log(props.word)
//   let word = props.word;
//   let isNoun = true;
//   // let isVerb = props.tags.includes('verb');
//   // let isParticle = props.tags.includes('particle');
//   // let isExclamation = props.tags.includes('exclamation');
//   // let isConjunction = props.tags.includes('conjunction');
//   // let isAdverb = props.tags.includes('adverb');
//   // let isPredicate = props.tags.includes('predicate');
//   // let isDemonstrative = props.tags.includes('demonstrative');
//   // let isInterjection = props.tags.includes('interjection');


//   // let isPostbase = props.tags.includes('postbase');
//   // let isEnclitic = props.tags.includes('enclitic');

//   // let isExpression = props.tags.includes('expression');
//   // let isCommon = props.tags.includes('grammar');
//   // let isHBC = props.tags.includes('Hooper Bay Chevak');


//   return (
//     <List.Item key={word.keyString}>
//     <Link to={{pathname: '/' + word.url, state: { word: word.keyString, }}}>
//       <List.Content>
//         <List.Header style={{display:'flex',fontSize:'16px',paddingBottom:'4px',fontFamily:"Roboto,'Helvetica Neue',Arial,Helvetica,sans-serif"}}>
//           {word.keySplit.map((w,index) => 
//               <span style={{'paddingRight':'3px'}}>
//               {/*{console.log(w)}*/}
//               {this.processStyledText(w[0])}
//               {w[1][0] !== '' ?
//                   <span style={{marginLeft:'3px',fontWeight:'100'}}>{"("+w[1].join(', ')+")"}</span>
//                 :
//                 (index == word.keySplit.length-1 ?
//                   ''
//                   :
//                   ', '
//                 )
//               }
//                 <span style={{ 'marginLeft': '15px'}}>  
//                   {isNoun ? <Label size='mini' style={{backgroundColor:'#7F90B0',color:'white'}}>NOUN</Label> : ''}
//                 </span>
//               </span>
//             )}
//         </List.Header>
//         <List.Description style={{fontSize:'16px',fontWeight:'400'}}>{word.definitionString}</List.Description>
//       </List.Content>
//     </Link>
//     </List.Item>
//   );
// }
