import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {summaries} from './info/summaries.js';
import {categories} from './info/categories.js';
import { API_URL, WEB_URL } from '../App.js';
import { FeaturedVideos } from './Helpers.js';
import {videoNum2cpb} from './info/videoNum2cpb.js';

let converter = {
	1:1,
	2:10,
	3:20,
	4:30,
	5:40,
	6:50,
	7:60,
	8:70,
	9:80,
	10:90,
}


class Browse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categoriesDisplayed:[],
			showPages:['1','2','3','4','5','6','7','8','9'],
			currentPage:1,
			maxPages:10, // cause there are only 95 videos
		}
		this.updatePage = this.updatePage.bind(this)

	}


	componentDidMount() {
		window.scrollTo({
			  top: 0,
			  // behavior: 'smooth'
			})
	}

	// componentDidUpdate(prevState) {
	// 	if (this.state.currentPage !== prevState.currentPage) {
	// 		window.scrollTo({top: 0, behavior: 'smooth'})
	// 	}
	// }

	updatePage = (currentPage) => {
		// console.log('updating')
		// alert("Hello! I am an alert box!");
		if (currentPage === 1) {
			this.setState({showPages:['1','2','3','4','5','6','7','8','9']})				
		} else {
			let newList = []
			for (let x=converter[currentPage];x<converter[currentPage]+10;x++) {
				newList.push(x.toString())
			}
			this.setState({showPages:newList})												
		}		
	}
	render() {
		console.log(this.state)
		return (
			<div>
				<div className='yugtatun'>Suuliaret Yuvriallerkarviat</div>
				<div className='yugtatunsub'>Browse Videos</div>

					{this.state.showPages.map((x,xind)=>
						(x in videoNum2cpb ?
							<FeaturedVideos x={videoNum2cpb[x]} xind={xind} width={window.innerWidth} />
							:
							null
						)
						)}


				<div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
					{this.state.currentPage !== 1 ?
						<Button style={{padding:7}} onClick={()=>{window.scrollTo({top: 0, behavior: 'smooth'});window.scrollTo({top: 0, behavior: 'smooth'}); this.setState({currentPage:this.state.currentPage-1}); this.updatePage(this.state.currentPage-1)}}>Prev</Button>
						:
						null
					}
					<Button onClick={()=>{window.scrollTo({top: 0, behavior: 'smooth'}); this.setState({currentPage:1}); this.updatePage(1)}} style={{padding:7,paddingRight:10,paddingLeft:10,background:(this.state.currentPage === 1 ? '#e28b02' : null)}}>{converter[1]}</Button>
					{this.state.currentPage > 4 ?
						(this.state.currentPage < this.state.maxPages - 2 ?
							<span style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
							<span style={{marginRight:'3px',fontSize:'7px',color:'grey'}}>•••</span>
								{[this.state.currentPage-2,this.state.currentPage-1,this.state.currentPage,this.state.currentPage+1,this.state.currentPage+2].map((x) => (<Button onClick={()=>{window.scrollTo({top: 0, behavior: 'smooth'}); this.setState({currentPage:x}); this.updatePage(x)}} style={{padding:7,paddingRight:10,paddingLeft:10,background:(this.state.currentPage === x ? '#e28b02' : null)}}>{converter[x]}</Button>))}
							<span style={{marginRight:'3px',fontSize:'7px',color:'grey'}}>•••</span>							
							</span>
							:
							<span style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
							<span style={{marginRight:'3px',fontSize:'7px',color:'grey'}}>•••</span>
								{[this.state.maxPages-4,this.state.maxPages-3,this.state.maxPages-2,this.state.maxPages-1,this.state.maxPages].map((x) => (<Button onClick={()=>{window.scrollTo({top: 0, behavior: 'smooth'}); this.setState({currentPage:x}); this.updatePage(x)}} style={{padding:7,paddingRight:10,paddingLeft:10,background:(this.state.currentPage === x ? '#e28b02' : null)}}>{converter[x]}</Button>))}
							</span>
							)
						:
						<span style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
							{[2,3,4,5,6].map((x) => (<Button onClick={()=>{window.scrollTo({top: 0, behavior: 'smooth'}); this.setState({currentPage:x}); this.updatePage(x)}} style={{padding:7,paddingRight:10,paddingLeft:10,background:(this.state.currentPage === x ? '#e28b02' : null)}}>{converter[x]}</Button>))}
							<span style={{marginRight:'3px',fontSize:'7px',color:'grey'}}>•••</span>							
						</span>
					}
					{this.state.currentPage !== this.state.maxPages ?
						<Button style={{padding:7}} onClick={()=>{window.scrollTo({top: 0, behavior: 'smooth'}); this.setState({currentPage:this.state.currentPage+1}); this.updatePage(this.state.currentPage+1)}}>Next</Button>
						:
						null
					}
				</div>

				<Divider style={{marginTop:'24px'}} />

				<div style={{display:'flex',justifyContent:'center',marginTop:'30px',marginBottom:'20px'}}>
					Man’a caliaq piurcimallruuq kenkekun Kuigpiim Kuskuqviim-llu yui pitekluki.
				</div>
			</div>
		);
	}
}
export default Browse;