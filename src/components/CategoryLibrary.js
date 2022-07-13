import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import { API_URL, WEB_URL } from '../App.js';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

class CategoryLibrary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categoriesDisplayed:[],
		}
		window.scrollTo({
			  top: 0,
			  // behavior: 'smooth'
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
			<div>

				<div className='yugtatun'>Ayuqenrilnguut Imait</div>
				<div className='yugtatunsub'>Video Categories</div>

				<div style={{display:'flex',justifyContent:'center',marginBottom:'10px'}}>
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
				 </div>

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


				<Divider style={{marginTop:'24px'}} />
				<div style={{display:'flex',justifyContent:'center',marginTop:'30px',marginBottom:'20px'}}>
					<div>Tarenrairat piyunarivkaumaut KYUK-mek</div>
		              <Popup
		                trigger={<Icon style={{fontSize:'18px',color:'#d4d4d4',width:'22px',marginLeft:'6px'}} link name='comment alternate outline'>{'\n'}</Icon>}
		                on='click'
		                content={<div style={{fontSize:'16px'}}>{'Photos provided by KYUK'}</div>}
		                position='top left'
		              />
				</div>

			</div>
		);
	}
}
export default CategoryLibrary;