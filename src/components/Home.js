import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {YouTubeLinks} from './info/YouTubeLinks.js';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';


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
			featuredVideos:['cpb-aacip-127-009w0z0q.h264','cpb-aacip-127-00ns1t6z.h264','cpb-aacip-127-010p2r15.h264',],
		}
	}

	featuredVideos = (featuredVideos) => {
		return (
		featuredVideos.map((x,xind) => <Grid.Row  columns={2} key={xind}>
		  		<Grid.Column width={6}>
			    	<Image style={{width:'250px',borderRadius:'15px'}} src='/images/popularVideo1.png' />
			    </Grid.Column>
			    <Grid.Column width={10}>
				    <div>
		  				<h4>{summaries[x].title}</h4>

          {summaries[x].tags.map((y)=>(
            y in categories ?
            <Link to={{pathname: '/category/'+categories[y].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
              <Button basic compact>
              {categories[y].name.replaceAll('--','—')}
              </Button>
            </Link>
            :
            null
          ))}

					    <span style={{fontFamily:"'Roboto',Arial, Helvetica"}}>{summaries[x].summary[0][1]}</span>
		          <Popup
		            trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
		            on='click'
		            content={<div style={{fontSize:'16px'}}>{summaries[x].summary[0][2]}</div>}
		            position='bottom left'
		          />					    
						</div>
					</Grid.Column>
		  </Grid.Row>		
			)
		)
	}

	featuredVideos1 = (featuredVideos) => {
		return (
		featuredVideos.map((x,xind) => <Grid.Row  columns={2} key={xind}>
		  		<Grid.Column width={6}>
			    	<Image style={{width:'250px',borderRadius:'15px'}} src='/images/popularVideo1.png' />
			    </Grid.Column>
			    <Grid.Column width={10}>
				    <div>
		  				<h4>{summaries[x].title}</h4>
					    <span style={{fontFamily:"'Roboto',Arial, Helvetica"}}>{summaries[x].yugtun['summary']}</span>
		          <Popup
		            trigger={<Icon style={{color:'#d4d4d4'}} link name='comment alternate outline'>{'\n'}</Icon>}
		            on='click'
		            content={<div style={{fontSize:'16px'}}>{summaries[x].english.summary[0]}</div>}
		            position='bottom left'
		          />					    
						</div>
					</Grid.Column>
		  </Grid.Row>		
			)
		)
	}

	render() {
		return (
			<div className='home'>

				<div style={{display:'flex'}}>
					<span style={{fontSize:'16px',color:'#333333',fontStyle:'italic',fontFamily:"'Roboto',Arial, Helvetica"}}>
					{"This website is an archive of translated and transcribed Yup'ik elder interviews. You can click a Yup'ik word to see its translation or click the\xa0\xa0"}
					<Icon style={{color:'#d4d4d4'}} name='comment alternate outline' />
					{'icon to see sentence translations.'}
					</span>
				</div>

				<Divider />

				<h1 className='yugtatun'>Tegganret Qalartellret - <i>Elder Speakers</i></h1>

				<div style={{display:'flex',justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}}>
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
				</div>

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

				<h1 className='yugtatun'>Suut Allakaryarat - <i>Video Categories</i></h1>

					<div style={{display:'flex',justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}}>
						{this.state.categoriesDisplayed.map((j) => (
							<div className='categoryButton'>
						  	<Link to={{pathname: '/category/'+categories[j].url, state: { currentCategory: j}}}>
							    <Image className='categoryImage' src='/images/categories1.jpg' />
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

				<h1 className='yugtatun'>Suurarkat - <i>Featured Videos</i></h1>

				<Container className='featured-video'>
					<Grid container>{this.featuredVideos(this.state.featuredVideos)}</Grid>
				</Container>

				<Divider style={{marginTop:'24px'}} />
				<div style={{display:'flex',justifyContent:'center',marginTop:'30px'}}>
					This website was made lovingly for our people in the Yukon Kuskokwim Delta.
				</div>

			</div>
		);
	}
}
export default Home;