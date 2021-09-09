import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';


class Category extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentCategory: props.location.state === undefined ? false : props.location.state.currentCategory,
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
					<Link to={{pathname:'/collections'}}>
						<div>{'All Categories'}</div>
					</Link>
						{this.state.parentCategories.map((j,jindex) => (
						  	<Link onClick={()=>{
						  		this.setState({currentCategory:j});
						  		this.retrieveFamilyCategories(j);
						  	}} to={{pathname: '/category/'+categories[j].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
							    <div style={{marginLeft:(20*(jindex+1))}} >{categories[j].name}</div>
							 </Link>
						))}

						<div style={{marginLeft:(20*(this.state.parentCategories.length+1))}}>{categories[this.state.currentCategory].name}</div>

						{this.state.childrenCategories.map((j) => (
						  	<Link className='categoryButton' onClick={()=>{
						  		
						  		this.retrieveFamilyCategories(j);
						  	}} to={{pathname: '/category/'+categories[j].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-")}}>
							    <div style={{marginLeft:(20*(this.state.parentCategories.length+2))}} >{categories[j].name}</div>
							 </Link>
						))}
					<div>{'Videos to Display by ID'}</div>
					<div>{categories[this.state.currentCategory].videoNumbers}</div>
				</Container>
				<Divider />

			</div>
		);
	}
}
export default Category;