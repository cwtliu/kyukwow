import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import { API_URL, WEB_URL } from '../App.js';

class CategoryLibrary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categoriesDisplayed:[],
		}
		window.scrollTo({
			  top: 0,
			  behavior: 'smooth'
			})
	}
	componentDidMount() {
		const categoriesDisplayed = [];
		for (var key of Object.keys(categories)) {
			if (!key.includes(".") && !key.includes('unsorted')) {
				categoriesDisplayed.push(key)
			}   
		}
		this.setState({ categoriesDisplayed: categoriesDisplayed });
	}

	render() {
		console.log(this.state)
		return (
			<div className='collections'>
				<Button.Group>
			      <Button active={true} icon>
			        <Icon name='grid layout' />
			      </Button >
			      <Link to={{pathname: '/category/all', state: { currentCategory: 'all'}}}>
			      <Button active={false} icon>
			        <Icon name='list' />
			      </Button>
			      </Link>
				 </Button.Group>
				<Container>
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


				</Container>
				<Divider style={{marginTop:'24px'}} />
				<div style={{display:'flex',justifyContent:'center',marginTop:'30px'}}>
					Photos provided by KYUK
				</div>

			</div>
		);
	}
}
export default CategoryLibrary;