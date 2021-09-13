import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';

class Collections extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categoriesDisplayed:[],
		}
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
				<Container>
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
					<h1 className='yugtun'>QQ-am Suut Allakaryarat</h1>
					<h1 className='yugtatun'>WoW Video Categories</h1>
					<div className='categoryGrid'>
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
				</Container>
				<Divider />

			</div>
		);
	}
}
export default Collections;