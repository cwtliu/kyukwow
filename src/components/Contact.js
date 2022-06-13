import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import { API_URL, WEB_URL } from '../App.js';



class Contact extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		// console.log(this.state)
		return (
			<div className='collections'>
				<div className='yugtatun'>Wangkuta</div>
				<div className='yugtatunsub'>Contact</div>
				<div style={{display:'flex',justifyContent:'center',marginTop:'30px'}}>
					This website was made lovingly for our people in the Yukon Kuskokwim Delta.
				</div>
			</div>
		);
	}
}
export default Contact;