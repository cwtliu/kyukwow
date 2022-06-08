import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {YouTubeLinks} from './info/YouTubeLinks.js';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import { FeaturedVideos } from './Helpers.js';
import { API_URL, WEB_URL } from '../App.js';


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

				<div style={{display:'flex',justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}}>
				{this.state.eldersList.map((y,yindex) => (
					(yindex < 16 ?
						<div style={{display:'flex',flexDirection:'column',margin:'10px',width:'140px'}}>
							<Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
							<Image style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
							{categories[y]['name'].includes('~') ?
								<div>
									<div style={{color:'#333333',display:'flex',justifyContent:'center',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
									<div style={{color:'#333333',display:'flex',justifyContent:'center'}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
								</div>
								:
								<div style={{color:'#333333',display:'flex',justifyContent:'center'}}>{categories[y]['name'].split('--')[0]}</div>
							}
							</Link>
						</div>
						:
						null
					)
				))}
				{this.state.showMoreElders ?
					(this.state.eldersList.map((y,yindex) => (
						(yindex > 15 ?
							<div style={{display:'flex',flexDirection:'column',margin:'10px',width:'140px'}}>
								<Link to={{pathname: '/category/'+categories[y]['url'], state: { currentCategory: y}}}>
								<Image style={{borderRadius:'10px'}} src={WEB_URL +'/images/EldersPhotos/'+categories[y]['images'][0]} />
								{categories[y]['name'].includes('~') ?
									<div>
										<div style={{color:'#333333',display:'flex',justifyContent:'center',fontWeight:'bold'}}>{categories[y]['name'].split('--')[0].split('~')[0]}</div>
										<div style={{color:'#333333',display:'flex',justifyContent:'center'}}>{categories[y]['name'].split('--')[0].split('~')[1]}</div>
									</div>
									:
									<div style={{color:'#333333',display:'flex',justifyContent:'center'}}>{categories[y]['name'].split('--')[0]}</div>
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
					<div style={{display:'flex',justifyContent:'center',margin:'24px'}}>
		        <Button basic style={{fontSize:16,fontFamily:"'Roboto',Arial, Helvetica"}} onClick={()=>{this.setState({showMoreElders:true})}}>
		          <div>
		          {"Cali - Show More"}
		          <Icon style={{paddingLeft:10}} name='chevron down' />
		          </div>
		        </Button>
	        </div>
	      }

				<Divider />

				<div className='yugtatun'>Suut Allakaryarat</div>
				<div className='yugtatunsub'>Video Categories</div>


					<div style={{display:'flex',justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}}>
						{this.state.categoriesDisplayed.map((j) => (
							<div className='categoryButton'>
						  	<Link to={{pathname: '/category/'+categories[j].url, state: { currentCategory: j}}}>
							    <Image className='categoryImage' src={WEB_URL +'/images/Categories/'+categories[j].images[0]} />
							    <div className='categoryText'>
							    	<div style={{fontWeight:'bold'}}>{categories[j].name.split(' -- ')[0]}</div>
							    	<div>{categories[j].name.split(' -- ')[1]}</div>
							    </div>
							  </Link>
							</div>
						))}
					</div>

					<div style={{display:'flex',justifyContent:'center',margin:'24px'}}>
						<Link to={{pathname: '/categorylibrary'}}>
			        <Button basic style={{fontSize:16,fontFamily:"'Roboto',Arial, Helvetica"}}>
			          <div>
			          {"See All Categories"}
			          <Icon style={{fontSize:20,paddingLeft:10}} name='chevron right' />
			          </div>
			        </Button>
		        </Link>
	        </div>

				<Divider />

				<div className='yugtatun'>Suurarkat</div>
				<div className='yugtatunsub'>Featured Videos</div>

					{this.state.featuredVideos.map((x,xind)=><FeaturedVideos x={x} xind={xind} width={window.innerWidth} />)}

				<Divider style={{marginTop:'24px'}} />
				<div style={{display:'flex',justifyContent:'center',marginTop:'30px'}}>
					This website was made lovingly for our people in the Yukon Kuskokwim Delta.
				</div>

			</div>
		);
	}
}
export default Home;