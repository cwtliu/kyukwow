import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import {categoriesUrlLookup} from './info/categoriesUrlLookup.js';
import {YouTubeLinks} from './info/YouTubeLinks.js';
import { FeaturedVideos } from './Helpers.js';
import { API_URL, WEB_URL } from '../App.js';


class Category extends Component {
	constructor(props) {
		super(props);
		this.ID = decodeURI(props.match.params.word);
		console.log(decodeURI(props.match.params.word))
		if (this.ID !== 'all') {
			this.categoryID = categoriesUrlLookup[this.ID];
		} else {
			this.categoryID = 'all';
		}
		
		this.state = {
			currentCategory: props.location.state === undefined ? this.categoryID : props.location.state.currentCategory,
			childrenCategories:[],
			parentCategories:[],
			categoriesDisplayed:[],
			decodedURI: decodeURI(props.match.params.word),
		}
		this.initialize = this.initialize.bind(this);
		window.scrollTo({
			  top: 0,
			  behavior: 'smooth'
			})
	}

	componentDidMount() {
		this.initialize();
  		window.scrollTo(0, 0)
		const categoriesDisplayed = [];
		for (var key of Object.keys(categories)) {
			if (!key.includes(".") && !key.includes('unsorted')) {
				categoriesDisplayed.push(key)
			}   
		}
		this.setState({ categoriesDisplayed: categoriesDisplayed });
	}
	componentDidUpdate(prevProps, prevState) {
		// console.log(prevProps.location.pathname)
		// console.log(this.props)
		if (this.state.currentCategory !== prevState.currentCategory) {
			window.scrollTo({
				  top: 0,
				  behavior: 'smooth'
				})
		}

		if (prevProps.location.pathname !== this.props.location.pathname && this.props.location.pathname !== '/category/all') {
			this.retrieveFamilyCategories(categoriesUrlLookup[decodeURI(this.props.match.params.word)]);
			// console.log('hi')
		}
	}

	// componentDidUpdate(prevState) {
	// 	if (prevState.currentCategory !== this.state.currentCategory) {
	// 		console.log('hi')
	// 		console.log(this.state.currentCategory)
	// 		this.initialize.bind();

	// 	}
	// }

	initialize() {
		if (this.ID !== 'all') {
		this.retrieveFamilyCategories(this.state.currentCategory);			
		}
	}

	retrieveFamilyCategories(j) {
		console.log(j)
		const children = [];
		const parents = [];
		for (let i = 1; i < categories[j].children + 1; i++) {
			children.push(j+'.'+i.toString())
		}
		if (j.includes('.')) {
			var p = j.split('.');
			for (let k = 1; k < p.length; k++) {
				parents.push((p.slice(0,k)).join('.'))
			}
		}
		this.setState({ 
			currentCategory: j,
			childrenCategories: children,
			parentCategories: parents,
			 });
	}

	render() {
		console.log(this.state,this.props)
		return (
			<div>
				<div className='yugtatun'>Ayuqenrilnguut Imait</div>
				<div className='yugtatunsub'>Video Categories</div>			
				<div style={{display:'flex',justifyContent:'center'}}>
				<Button.Group style={{marginBottom:'10px'}}>
				<Link to='/categorylibrary'>
			      <Button active={false} icon>
			        <Icon name='grid layout' />
			      </Button >\
			    </Link>
			      <Button active={true} icon>
			        <Icon name='list' />
			      </Button>
				  </Button.Group>
				</div>
				{this.state.currentCategory === 'all' ?
					<div style={{fontSize:'18px',lineHeight:'22px',maxWidth:'500px',marginLeft:'auto',marginRight:'auto',marginTop:'20px',marginBottom:'20px'}}>
					    <div style={{fontWeight:'600',marginTop:'3px'}}>{'Tamarmeng Allakaryarat'}</div>
					    <div style={{marginLeft:3,color:'#414141'}}>{'All Categories'}</div>
						{this.state.categoriesDisplayed.map((j) => (
						  	<Link onClick={()=>{
						  		this.retrieveFamilyCategories(j);
						  		}} to={{pathname: '/category/'+categories[j].url}}>
								    <div style={{marginLeft:24}}>
								    <div style={{fontWeight:'600',marginTop:'3px'}}>{categories[j].name.split("--")[0].replace('~','–')}</div>
								    <div style={{marginLeft:3,color:'#8fa4bb'}}>{categories[j].name.split("--")[1]}</div>
								    </div>								    
							  </Link>
						))}
					</div>
					:
					<div>
					<div style={{fontSize:'18px',lineHeight:'22px',maxWidth:'500px',marginLeft:'auto',marginRight:'auto',marginTop:'20px'}}>

						<Link onClick={()=>{
							  		this.setState({
							  			currentCategory:'all',
										childrenCategories: [],
										parentCategories: [],						  			
							  		});
							  	}}
							 to={{pathname:'/category/all'}}>
						    <div style={{fontWeight:'600',marginTop:'3px'}}>{'Tamarmeng Allakaryarat'}</div>
						    <div style={{marginLeft:0,color:'#8fa4bb'}}>{'All Categories'}</div>
						</Link>

						{this.state.parentCategories.map((j,jindex) => (
						  	<Link onClick={()=>{
						  		this.setState({currentCategory:j});
						  		this.retrieveFamilyCategories(j);
						  	}} to={{pathname: '/category/'+categories[j]['url']}}>
							    <div style={{marginLeft:(24*(jindex+1))}}>
							    <div style={{fontWeight:'600',marginTop:'3px'}}>{categories[j].name.split("--")[0].replace('~','–')}</div>
							    <div style={{marginLeft:0,color:'#8fa4bb'}}>{categories[j].name.split("--")[1]}</div>
							    </div>								    
							 </Link>
						))}

					    <div style={{marginLeft:(24*(this.state.parentCategories.length+1))}}>
					    <div style={{fontWeight:'600',marginTop:'3px'}}>{categories[this.state.currentCategory].name.split("--")[0].replace('~','–')}</div>
					    <div style={{marginLeft:0,color:'#414141'}}>{categories[this.state.currentCategory].name.split("--")[1]}</div>
					    </div>		

						{this.state.childrenCategories.map((j) => (
							j in categories ?
						  	<Link onClick={()=>{
						  		
						  		this.retrieveFamilyCategories(j);
						  	}} to={{pathname: '/category/'+categories[j]['url']}}>

							    <div style={{marginLeft:(24*(this.state.parentCategories.length+2))}}>
							    <div style={{fontWeight:'600',marginTop:'3px'}}>{categories[j].name.split("--")[0].replace('~','–')}</div>
							    <div style={{marginLeft:0,color:'#8fa4bb'}}>{categories[j].name.split("--")[1]}</div>
							    </div>		

							 </Link>
							 :
							 null
						))}

					</div>


					{this.state.currentCategory !== '23' ?
						<div style={{paddingTop:'20px'}}>
						<Divider />
						<div style={{display:'flex',justifyContent:'center',textAlign:'center',fontSize:'22px',fontWeight:'bold',lineHeight:'35px',paddingTop:'10px',color:'#777777',maxWidth:'750px',marginLeft:'auto',marginRight:'auto',}}>{`"`+categories[this.state.currentCategory].name.split("--")[0].replace('~','-').trim()+`"`+' suuliaret nataqat wantut'}</div>
						{categories[this.state.currentCategory].videoNumbers.map((x,xind)=><FeaturedVideos x={x} xind={xind} width={window.innerWidth} />)}
						<div onClick={()=>{window.scrollTo({top: 0,behavior: 'smooth'})}}style={{cursor:'pointer',textDecoration:'underline',fontSize:'16px',display:'flex',justifyContent:'center',marginBottom:'10px'}}> Back to Top </div>
						</div>
						:
						null
					}


					</div>

					}

			</div>
		);
	}
}
export default Category;