import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {YouTubeLinks} from './info/YouTubeLinks.js';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import { FeaturedVideos } from './Helpers.js';
import { API_URL, WEB_URL } from '../App.js';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ReactGA from "react-ga4";
ReactGA.initialize("G-JZB9CXH4GJ")
// const categories = _.times(6, (i) => (
//   <Grid.Column key={i}>
//   	<div>
// 	    <Image src='/images/categories1.jpg' />
// 	    <h3 className='yugtun'>Ellavut</h3>
// 	    Weather, Climate
// 	  </div>
//   </Grid.Column>
// ))

// const keywords = _.times(6, (i) => (
//   <Grid.Column key={i}>
//   	<Button basic color='blue' size='mini'>Yugtun<br /><em>inYup'ik</em></Button>
//   </Grid.Column>
// ))


class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			showAllElders: false,
			categoriesDisplayed: ['1','2','3','4','5','6'],
			featuredVideos:['cpb-aacip-127-009w0z0q.h264','cpb-aacip-127-00ns1t6z.h264','cpb-aacip-127-010p2r15.h264','cpb-aacip-127-65v6x4wh.h264'],
			eldersList: [],
		}
	}

	componentDidMount() {
		let eldersList = []
		Object.keys(categories).map((k) => {
			if (k.includes('23.')) {
				eldersList.push(k)
			}
		})
		this.setState({eldersList:eldersList})
	}

	// summariesRetrieval = (x, index) => {
	// 			return (<span> 
	// 						<span style={{fontFamily:"'Roboto',Arial, Helvetica",fontSize:'14px'}}>{summaries[x].summary[index][1]}</span>
	// 	          <Popup
	// 	            trigger={<Icon style={{color:'#d4d4d4',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
	// 	            on='click'
	// 	            content={<div style={{fontSize:'16px'}}>{summaries[x].summary[index][2]}</div>}
	// 	            position='bottom left'
	// 	          />
	// 	          </span>
	// 		)
	// }

	// featuredVideos = (x,xind) => {
	// 	var stringLengthCounter = 0
	// 	var upToIndex = 0
	// 	while (stringLengthCounter < 300 && upToIndex < summaries[x].summary.length) {
	// 		stringLengthCounter += summaries[x].summary[upToIndex][1].length
	// 		upToIndex += 1
	// 	}
	// 	return (
	//      (window.innerWidth < 480 ?
	// 			<Grid style={{marginTop:30,marginBottom:30}} container>
	// 				<Grid.Row key={xind}>
	// 		  		<Grid.Column style={{display:'flex',justifyContent:'center'}}>
	// 						<Link style={{maxWidth:'240px'}} to={{pathname: '/video/'+x, state: { currentVideoId: x}}}>
	// 							<Image style={{borderRadius:'10px'}} src={"https://img.youtube.com/vi/"+
	// 							YouTubeLinks[x].split(".be/")[1]
	// 							+"/hqdefault.jpg"} />
	// 						</Link>			    
	// 					</Grid.Column>
	// 		  	</Grid.Row>		
	// 		  	<Grid.Row>
	// 			    <Grid.Column>
	// 				    	<Link style={{display:'flex',justifyContent:'center',color:'black'}} to={{pathname: '/video/'+x, state: { currentVideoId: x}}}>
	// 		  					<div style={{fontSize:'16px',fontWeight:'600',paddingBottom:10}}>{summaries[x].title}</div>
	// 		  				</Link>
	// 		  				{Array.from({length: upToIndex}, (_, i) => i ).map((y) => this.summariesRetrieval(x,y) )}
	// 		  				{'. . .'}    
	// 					</Grid.Column>
	// 		  	</Grid.Row>
	// 		  	<Grid.Row style={{display:'flex',justifyContent:'center'}}>
	// 		  	<div style={{maxWidth:700,textAlign:'center',lineHeight:'34px'}}>
	// 			  {summaries[x].tags.map((y)=>(
	//           y in categories ?
	//           <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
	//             <Button basic compact>
	//             {categories[y].name.replaceAll('--','—')}
	//             {/*{categories[y].name.split(' -- ')[0]}*/}
	//             </Button>
	//           </Link>
	//           :
	//           null
	//         ))}
 //          <Popup
 //            trigger={<Icon style={{color:'#d4d4d4',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
 //            on='click'
 //            content={<div style={{fontSize:'16px'}}>{''}</div>}
 //            position='bottom left'
 //          />
	// 		  	</div>
	// 		  	</Grid.Row>
	// 		  </Grid>
	// 		  :
	// 			<Grid style={{marginTop:30,marginBottom:30}} container>
	// 				<Grid.Row columns={2} key={xind}>
	// 		  		<Grid.Column style={{display:'flex',justifyContent:'flex-end'}} width={6}>
	// 						<Link style={{maxWidth:'240px'}} to={{pathname: '/video/'+x, state: { currentVideoId: x}}}>
	// 							<Image style={{borderRadius:'10px'}} src={"https://img.youtube.com/vi/"+
	// 							YouTubeLinks[x].split(".be/")[1]
	// 							+"/hqdefault.jpg"} />
	// 						</Link>			    
	// 					</Grid.Column>
	// 			    <Grid.Column width={10}>
	// 				    <div style={{maxWidth:450}}>
	// 				    	<Link style={{color:'black'}} to={{pathname: '/video/'+x, state: { currentVideoId: x}}}>
	// 		  					<div style={{fontSize:'16px',fontWeight:'600',paddingBottom:10}}>{summaries[x].title}</div>
	// 		  				</Link>
	// 		  				{Array.from({length: upToIndex}, (_, i) => i ).map((y) => this.summariesRetrieval(x,y) )}
	// 		  				{'. . .'}    
	// 						</div>
	// 					</Grid.Column>
	// 		  	</Grid.Row>		
	// 		  	<Grid.Row style={{display:'flex',justifyContent:'center'}}>
	// 		  	<div style={{maxWidth:700,textAlign:'center',lineHeight:'34px'}}>
	// 			  {summaries[x].tags.map((y)=>(
	//           y in categories ?
	//           <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
	//             <Button basic compact>
	//             {/*{categories[y].name.replaceAll('--','—')}*/}
	//             {categories[y].name.split(' -- ')[0]}
	//             </Button>
	//           </Link>
	//           :
	//           null
	//         ))}
 //          <Popup
 //            trigger={<Icon size='large' style={{color:'#d4d4d4',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
 //            on='click'
 //            content={summaries[x].tags.map((y)=><div style={{fontSize:'16px'}}>{y}</div>)}
 //            position='bottom left'
 //          />
	// 		  	</div>
	// 		  	</Grid.Row>
	// 		  </Grid>
	// 		)
	// 	)
	// }

	// featuredVideos1 = (featuredVideos) => {
	// 	return (
	// 	featuredVideos.map((x,xind) => <Grid container>
	// 			<Grid.Row  columns={2} key={xind}>
	// 	  		<Grid.Column width={6}>
	// 		    	<Image style={{width:'250px',borderRadius:'15px'}} src='/images/popularVideo1.png' />
	// 		    </Grid.Column>
	// 		    <Grid.Column width={10}>
	// 			    <div>
	// 	  				<h4>{summaries[x].title}</h4>
	// 				    <span style={{fontFamily:"'Roboto',Arial, Helvetica"}}>{summaries[x].yugtun['summary']}</span>
	// 	          <Popup
	// 	            trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
	// 	            on='click'
	// 	            content={<div style={{fontSize:'16px'}}>{summaries[x].english.summary[0]}</div>}
	// 	            position='bottom left'
	// 	          />					    
	// 					</div>
	// 				</Grid.Column>
	// 	  	</Grid.Row>		
	// 	  </Grid>
	// 		)
	// 	)
	// }

	render() {
		console.log(this.props)

		return (
			<div className='home'>

				<div className='yugtatun'>Tegganret Qalartellret</div>
				<div className='yugtatunsub'>Elder Speakers</div>

				<div style={{display:'flex',justifyContent:'center',flexDirection:'row',flexWrap:'wrap',maxWidth:'820px',marginLeft:'auto',marginRight:'auto'}}>
				{this.state.eldersList.map((y,yindex) => (
					(yindex < 20 ?
						<div style={{display:'flex',flexDirection:'column',margin:'10px',width:'140px'}}>
							<Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
							<LazyLoadImage effect='blur' height={'105px'} width={'140px'} style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
							{categories[y]['name'].includes('~') ?
								<div>
									<div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
									<div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center'}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
								</div>
								:
								<div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center'}}>{categories[y]['name'].split('--')[0]}</div>
							}
							</Link>
						</div>
						:
						null
					)
				))}
				{this.state.showMoreElders ?
					(this.state.eldersList.map((y,yindex) => (
						(yindex > 19 ?
							<div style={{display:'flex',flexDirection:'column',margin:'10px',width:'140px'}}>
								<Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
								<LazyLoadImage effect='blur' height={'105px'} width={'140px'}  style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
								{categories[y]['name'].includes('~') ?
									<div>
										<div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
										<div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center',}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
									</div>
									:
									<div style={{color:'#333333',display:'flex',justifyContent:'center',textAlign:'center'}}>{categories[y]['name'].split('--')[0]}</div>
								}
								</Link>
							</div>
							:
							null
						)
					)))
					:
					null
	      }
				</div>


{/*				<div style={{display:'flex',justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}}>
				{Object.keys(YouTubeLinks).map((y,yindex) => (
					(yindex < 12 ?
						<div style={{display:'flex',flexDirection:'column',margin:'10px'}}>
							<Link to={{pathname: '/video/'+y, state: { currentVideoId: y}}}>
							<Image style={{width:'140px',borderRadius:'10px'}} src={"https://img.youtube.com/vi/"+
							YouTubeLinks[y].split(".be/")[1]
							+"/hqdefault.jpg"} />
							<div style={{color:'#333333',display:'flex',justifyContent:'center'}}>Mik'aq Eliza Chase</div>
							</Link>
						</div>
						:
						null
					)
				))}
				{this.state.showMoreElders ?
					(Object.keys(YouTubeLinks).map((y,yindex) => (
						(yindex > 11 ?
							<div style={{display:'flex',flexDirection:'column',margin:'10px'}}>
								<Link to={{pathname: '/video/'+y, state: { currentVideoId: y}}}>
								<Image style={{width:'140px',borderRadius:'10px'}} src={"https://img.youtube.com/vi/"+
								YouTubeLinks[y].split(".be/")[1]
								+"/hqdefault.jpg"} />
								<div style={{color:'#333333',display:'flex',justifyContent:'center'}}>Mik'aq Eliza Chase</div>
								</Link>
							</div>
							:
							null
						)
					)))
					:
					null
	      }
				</div>*/}

				{this.state.showMoreElders ?
					null
					:
					<div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',margin:'24px'}}>


			        <Button basic style={{fontSize:16,display:'flex',flexDirection:'row',alignItems:'center'}} onClick={()=>{this.setState({showMoreElders:true})}}>
			          <span style={{fontSize:16,lineHeight:'20px',marginRight:'10px'}}>{"Allanek Tegganernek Nasvisnga"}</span>
			          <Icon style={{float:'right',fontSize:16}} name='chevron down' />
			        </Button>	

	              <Popup hideOnScroll
	                trigger={<Icon style={{fontSize:'22px',color:'#d4d4d4',width:'22px',marginTop:'8px'}} link name='comment alternate outline'>{'\n'}</Icon>}
	                on='click'
	                content={<div style={{fontSize:'16px'}}>{'Show me more elders'}</div>}
	                position='bottom'
	              />
	        </div>
	      }

				<Divider />

				<div className='yugtatun'>Ayuqenrilnguut Imait</div>
				<div className='yugtatunsub'>Video Categories</div>


					<div style={{display:'flex',justifyContent:'center',flexDirection:'row',flexWrap:'wrap',maxWidth:'820px',marginLeft:'auto',marginRight:'auto'}}>
						{this.state.categoriesDisplayed.map((j) => (
							<div className='categoryButton' style={{margin:'20px'}}>
						  	<Link to={{pathname: '/category/'+categories[j].url, state: { currentCategory: j}}}>
						  		<div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',backgroundColor:'white',color:'black',padding:'20px',maxWidth:'60%',opacity:'90%',borderRadius:'10px'}}>
							    	<div style={{fontWeight:'bold'}}>{categories[j].name.split(' -- ')[0]}</div>
							    	<div>{categories[j].name.split(' -- ')[1]}</div>
							    </div>
							    <LazyLoadImage effect='opacity' width={'300px'} height={'200px'} style={{borderRadius:'10px'}} src={WEB_URL +'/images/Categories/'+categories[j].images[0]} />
							  </Link>
							</div>
						))}
					</div>

					<div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',margin:'24px'}}>
						<Link to={{pathname: '/categorylibrary'}}>
			        <Button basic style={{fontSize:16,display:'flex',flexDirection:'row',alignItems:'center'}}>
			          <span style={{fontSize:16,lineHeight:'20px'}}>{"Suuliaret Ayuqenrilnguut Tamalkuita Yuvrirviat"}</span>
			          <Icon style={{float:'right',fontSize:16}} name='chevron right' />
			        </Button>			        
		        </Link>
	              <Popup hideOnScroll
	                trigger={<Icon style={{fontSize:'22px',color:'#d4d4d4',width:'22px',marginTop:'8px'}} link name='comment alternate outline'>{'\n'}</Icon>}
	                on='click'
	                content={<div style={{fontSize:'16px'}}>{'See All Categories'}</div>}
	                position='bottom'
	              />
	        </div>

				<Divider />

				<div className='yugtatun'>Suuliaret Paivcimalriit</div>
				<div className='yugtatunsub'>Featured Videos</div>

					{this.state.featuredVideos.map((x,xind)=><FeaturedVideos x={x} xind={xind} width={window.innerWidth} />)}

					<div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',margin:'24px'}}>
						<Link to={{pathname: '/browse'}}>
			        <Button basic style={{fontSize:16,display:'flex',flexDirection:'row',alignItems:'center'}}>
			          <span style={{fontSize:16,lineHeight:'20px'}}>{"Suuliaret Tamalkuita Yuvriallerkarviat"}</span>
			          <Icon style={{float:'right',fontSize:16}} name='chevron right' />
			        </Button>
		        </Link>
	              <Popup hideOnScroll
	                trigger={<Icon style={{fontSize:'22px',color:'#d4d4d4',width:'22px',marginTop:'8px'}} link name='comment alternate outline'>{'\n'}</Icon>}
	                on='click'
	                content={<div style={{fontSize:'16px'}}>{'Browse All Videos'}</div>}
	                position='top left'
	              />		        
	        </div>


				<Divider style={{marginTop:'24px'}} />
				<div style={{display:'flex',justifyContent:'center',textAlign:'center',marginTop:'30px',marginBottom:'20px'}}>
					<div>{'Man’a caliaq piurcimallruuq kenkekun Kuigpiim Kuskuqviim-llu yui pitekluki.'}
		              <Popup hideOnScroll
		                trigger={<Icon style={{fontSize:'18px',color:'#d4d4d4',width:'22px',marginLeft:'6px'}} link name='comment alternate outline'>{'\n'}</Icon>}
		                on='click'
		                content={<div style={{fontSize:'14px'}}>{'This work came into existence with love for our people in the Yukon Kuskokwim Delta.'}</div>}
		                position='top left'
		              />
	                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeZDEwbmwVyfEawQe3T5wADEQpeMgWKdIsuQY-TPtEk2dVHaQ/viewform?usp=sf_link" target="_blank">
	                  <div style={{cursor:'pointer',paddingTop:'10px',paddingLeft:'8px'}}>
	                  <Icon style={{color:'#a9a9a9',}} name='exclamation circle' />
	                  <span style={{fontSize:'14px',color:'#9d9d9d',fontWeight:'400',lineHeight:'23px'}}>Report an Issue</span>
	                  </div>
	                </a>
					</div>
				</div>

			</div>
		);
	}
}
export default Home;