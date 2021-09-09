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
					<h1 className='yugtun'>QQ-am Suut Allakaryarat</h1>
					<h1 className='yugtatun'>WoW Video Categories</h1>
					<Grid container columns={2}>
						{this.state.categoriesDisplayed.map((j) => (
						  <Grid.Column id={j}>
						  	<Link className='categoryButton' to={{pathname: '/category/'+categories[j].name.split(' -- ')[0].replaceAll("'","").replaceAll(/, | & | /g,"-"), state: { currentCategory: j}}}>
							    <Image src='/images/categories1.jpg' />
							    <div className='categoryText'>
							    <div className='yugtun'>{categories[j].name}</div>
							    </div>
							  </Link>
						  </Grid.Column>
						))}
					</Grid>
					<Button color='orange'>Tamarmeng Allakaryarat<br /><em>All Categories</em></Button>
				</Container>
				<Divider />

			</div>
		);
	}
}
export default Collections;