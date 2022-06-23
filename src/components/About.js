import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import { API_URL, WEB_URL } from '../App.js';



class About extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		// console.log(this.state)
		return (
			<div>
				<div className='yugtatun'>Wangkuta</div>
				<div className='yugtatunsub'>All of us</div>
				<div style={{display:'flex',justifyContent:'center',flexDirection:'column',fontSize:'16px',maxWidth:'420px',marginLeft:'auto',marginRight:'auto'}}>
					<div style={{marginTop:'10px'}}>
						This website was made lovingly by <a target="_blank" href={'https://yuarcuun.github.io/'}>Yuarcuun Technologies</a>, a team of two Yup'ik software developers who grew up in the Yukon Kuskokwim Delta.
					</div>
					<div style={{marginTop:'30px'}}>
						Quyavikaput all of the elders featured and their shared wisdom. 
					</div>
					<div style={{marginTop:'30px'}}>
						We are especially thankful for Corey Al'aq Joseph who was integral in creating the category list and translating, transcribing, and classifying many of the interviews. 
					</div>
					<div style={{marginTop:'30px'}}>
						We also want to thank Barbara Maklak Liu for translating and transcribing videos. Quyana Vernon Pikaniralria Chimegalrea and Colleen Laraux for translations of website terms. 
					</div>
					<div style={{marginTop:'30px'}}>
						This website was made possible through partnership with KYUK and funding by the 2021 Alaska Humanities Forum Annual Grants Program. 
					</div>
				</div>
			</div>
		);
	}
}
export default About;