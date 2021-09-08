import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


const categoryNames = [
	'Yugtun Qalarcaraq -- Yup\'ik Language',
	'Nunat Mer\'et-llu Atrit -- Place Names For Land And Bodies Of Water',
	'Qaneryarat -- Dialects',
	'Ellavut -- Weather, Climate',
	'Yuut -- People',
	'Ungungssit Mermiutaat-llu -- Land And Water Animals'
]

const categories = _.times(6, (i) => (
  <Grid.Column key={i}>
  	<Link className='categoryButton' to={{pathname: '/category/'+categoryNames[i]}}>
	    <Image src='/images/categories1.jpg' />
	    <div className='categoryText'>
	    <h3 className='yugtun'>{categoryNames[i]}</h3>
	    Weather, Climate, {i}
	    </div>
	  </Link>
  </Grid.Column>
))

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
		}
	}
	render() {
		const ID = 'cpb-aacip-127-558czhn9.h264';
		return (
			<div className='collections'>
{/*				<Link to={{pathname: '/video/'+ID, state: { currentVideoId: ID}}}>
				<Button>{'Hi'}</Button>
				</Link>*/}
				<Container>
					<h1 className='yugtun'>QQ-am Suut Allakaryarat</h1>
					<h1 className='yugtatun'>WoW Video Categories</h1>
					<Grid container columns={2}>{categories}</Grid>
					<Button color='orange'>Tamarmeng Allakaryarat<br /><em>All Categories</em></Button>
				</Container>
				<Divider />

			</div>
		);
	}
}
export default Home;