import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import { API_URL, WEB_URL } from '../App.js';
import ReactGA from "react-ga4";
ReactGA.initialize("G-JZB9CXH4GJ")


class About extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		// console.log(this.state)
		return (
			<div style={{marginBottom:30}}>
				<div className='yugtatun'>Wangkuta</div>
				<div className='yugtatunsub'>All of us</div>
				<div style={{display:'flex',justifyContent:'center',padding:10,flexDirection:'column',fontSize:'16px',maxWidth:'420px',marginLeft:'auto',marginRight:'auto'}}>
					<div style={{marginTop:'10px'}}>
						This website was made lovingly by <a target="_blank" href={'https://yuarcuun.github.io/'}>Yuarcuun Technologies</a>, a team of two Yup'ik software developers who grew up in the Yukon Kuskokwim Delta.
					</div>
					<div style={{marginTop:'30px'}}>
						Quyavikaput all of the elders featured and their shared wisdom. 
					</div>
					<div style={{marginTop:'30px'}}>
						We are especially thankful for Arnapagaq (Corey Joseph) who was integral in creating the category list and translating, transcribing, and classifying many of the interviews. 
					</div>
					<div style={{marginTop:'30px'}}>
						We also want to thank Maklak (Barbara Liu) for translating and transcribing. Quyana Pikaniralria (Vernon Chimegalrea) and Kaligtuq (Colleen Laraux) for translations of website terms. 
					</div>
					<div style={{marginTop:'30px'}}>
						This website was made possible through partnership with KYUK. 
					</div>
					<div style={{marginTop:'30px'}}>
						This project is supported in part by a grant from the Alaska Humanities Forum and the National Endowment for the Humanities, a federal agency. Any views, findings, conclusions or recommendations expressed in this (publication) (program) (website) (etc.) do not necessarily represent those of the National Endowment for the Humanities.					
					</div>
				</div>		
			</div>
		);
	}
}
export default About;