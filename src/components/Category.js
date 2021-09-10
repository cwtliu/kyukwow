import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import {categoriesUrlLookup} from './info/categoriesUrlLookup.js';
import {YouTubeLinks} from './info/YouTubeLinks.js';


class Category extends Component {
	constructor(props) {
		super(props);
		this.ID = decodeURI(props.match.params.word);
		this.categoryID = categoriesUrlLookup[this.ID];

		this.state = {
			currentCategory: props.location.state === undefined ? this.categoryID : props.location.state.currentCategory,
			childrenCategories:[],
			parentCategories:[],
		}
		this.initialize = this.initialize.bind(this);
	}
	componentDidMount() {
		this.initialize();
	}

	// componentDidUpdate(prevState) {
	// 	if (prevState.currentCategory !== this.state.currentCategory) {
	// 		console.log('hi')
	// 		console.log(this.state.currentCategory)
	// 		this.initialize.bind();

	// 	}
	// }

	initialize() {
		this.retrieveFamilyCategories(this.state.currentCategory);
	}

	retrieveFamilyCategories(j) {
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
{/*				<Link to={{pathname: '/video/'+ID, state: { currentVideoId: ID}}}>
				<Button>{'Hi'}</Button>
				</Link>*/}
				<Container>
					<div style={{fontSize:'20px',lineHeight:'25px'}}>
					<Link to={{pathname:'/collections'}}>
						<div>{'All Categories'}</div>
					</Link>
						{this.state.parentCategories.map((j,jindex) => (
						  	<Link onClick={()=>{
						  		this.setState({currentCategory:j});
						  		this.retrieveFamilyCategories(j);
						  	}} to={{pathname: '/category/'+categories[j].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
							    <div style={{marginLeft:(20*(jindex+1))}} >{categories[j].name.replace("--","—")}</div>
							 </Link>
						))}

						<div style={{marginLeft:(20*(this.state.parentCategories.length+1))}}>{categories[this.state.currentCategory].name.replace("--","—")}</div>

						{this.state.childrenCategories.map((j) => (
						  	<Link onClick={()=>{
						  		
						  		this.retrieveFamilyCategories(j);
						  	}} to={{pathname: '/category/'+categories[j].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
							    <div style={{marginLeft:(20*(this.state.parentCategories.length+2))}} >{categories[j].name.replace("--","—")}</div>
							 </Link>
						))}
					</div>
					<Divider />

					<div style={{fontSize:'30px',fontWeight:'bold',lineHeight:'45px',paddingBottom:'20px',color:'#777777'}}>{'We found '+categories[this.state.currentCategory].videoNumbers.length+` videos about "`+categories[this.state.currentCategory].name.replace("--","—")+`"`}</div>
				
					<Grid container columns={4}>
						{categories[this.state.currentCategory].videoNumbers.map((y) => (
							  <Grid.Column id={y}>
								<Link style={{width:'100px',borderRadius:'10px'}} to={{pathname: '/video/'+y, state: { currentVideoId: y}}}>
									<Image style={{width:'250px',borderRadius:'10px'}} src={"https://img.youtube.com/vi/"+
									YouTubeLinks[summaries[y].videoID].split(".be/")[1]
									+"/hqdefault.jpg"} />
								</Link>
							  </Grid.Column>
						))}
					</Grid>


				</Container>

			</div>
		);
	}
}
export default Category;