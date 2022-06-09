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
		console.log(this.state)
		return (
			<div className='collections'>
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
				{this.state.currentCategory === 'all' ?
					<div style={{fontSize:'20px',lineHeight:'25px'}}>
						<div>{'All Categories'}</div>
						{this.state.categoriesDisplayed.map((j) => (
						  	<Link onClick={()=>{
						  		this.retrieveFamilyCategories(j);
						  		}} to={{pathname: '/category/'+categories[j].url}}>
							    <div style={{marginLeft:20}}>{categories[j].name.replace("--","—")}</div>
							  </Link>
						))}
					</div>
					:
					<div>
					<div style={{fontSize:'20px',lineHeight:'25px'}}>

						<Link onClick={()=>{
							  		this.setState({
							  			currentCategory:'all',
										childrenCategories: [],
										parentCategories: [],						  			
							  		});
							  	}}
							 to={{pathname:'/category/all'}}>
							<div>{'All Categories'}</div>
						</Link>

						{this.state.parentCategories.map((j,jindex) => (
						  	<Link onClick={()=>{
						  		this.setState({currentCategory:j});
						  		this.retrieveFamilyCategories(j);
						  	}} to={{pathname: '/category/'+categories[j]['url']}}>
							    <div style={{marginLeft:(20*(jindex+1))}} >{categories[j].name.replace("--","—")}</div>
							 </Link>
						))}

						<div style={{marginLeft:(20*(this.state.parentCategories.length+1))}}>{categories[this.state.currentCategory].name.replace("--","—")}</div>

						{this.state.childrenCategories.map((j) => (
						  	<Link onClick={()=>{
						  		
						  		this.retrieveFamilyCategories(j);
						  	}} to={{pathname: '/category/'+categories[j]['url']}}>
							    <div style={{marginLeft:(20*(this.state.parentCategories.length+2))}} >{categories[j].name.replace("--","—")}</div>
							 </Link>
						))}

					</div>


					{this.state.currentCategory !== '23' ?
						<div>
						<Divider />
						<div style={{fontSize:'26px',fontWeight:'bold',lineHeight:'40px',paddingBottom:'10px',color:'#777777'}}>{'We found '+categories[this.state.currentCategory].videoNumbers.length+` videos with "`+categories[this.state.currentCategory].name.replace("--","—")+`"`}</div>
						{categories[this.state.currentCategory].videoNumbers.map((x,xind)=><FeaturedVideos x={x} xind={xind} width={window.innerWidth} />)}
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