import _ from 'lodash'
import React, { Component } from 'react';
import { Container, Header, Button, Icon, Divider, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


const categories = _.times(6, (i) => (
  <Grid.Column key={i}>
  	<div>
	    <Image src='/images/categories1.jpg' />
	    <h3 className='yugtun'>Ellavut</h3>
	    Weather, Climate
	  </div>
  </Grid.Column>
))

const keywords = _.times(6, (i) => (
  <Grid.Column key={i}>
  	<Button basic color='blue' size='mini'>Yugtun<br /><em>inYup'ik</em></Button>
  </Grid.Column>
))

const popularVideos = _.times(2, (i) => (
  <Grid.Row key={i}>
  	<div>
  		<h4>Ackiar Nick Lupie - Tuntutuliarmi - #7 / Ackiar Nick Lupie - Tuntutuliak - #7</h4>
	    <Image src='/images/popularVideo1.png' size='medium'/>
	    <div className="videoDescription">
		    <p>Ackiar (Nick Lupie) Tuntutuliarmiu interview-ami qalartellruuq uksuarmi up'ngelallritnek. Qalarutekluki taluyat ayuqenrilngurnek, neqet qeciit teq'uciriyaraatnek, canegnek uptetullritnek, ayagaaqameng-llu inerquutnek uksuarmi.</p>
				<p>Nick Lupie (Ackiar) of Tuntutuliak (Tuntutuliaq) in the interview talked about how people got ready for the fall. He talked about the many types of fish traps, fish skins and aging urine, preparing grass, and admonishments for traveling in the fall.</p>
			</div>
			Keyword-at:<Grid container>{keywords}</Grid>
	  </div>
  </Grid.Row>
))

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
		}
	}
	render() {
		const ID = '2';
		return (
			<div className='home'>
				<Container className='home-header'>
					<Image src="/images/home-header.jpg" alt="Snow"/>
					<div className='header-text'>
						<h1 className='yugtun'>Qaneryaram Qairi</h1>
						<h1 className='yugtatun'>Waves of Wisdom</h1>
					</div>
				</Container>
				<Link to={{pathname: '/video/'+ID, state: { currentVideoId: ID}}}>
				<Button>{'Hi'}</Button>
				</Link>
				<Divider />
				<Container className='featured-video'>
					<h2>Suurarkat / Featured Videos</h2>
				</Container>
				<Divider />
				<Container>
					<h2 className='yugtun'>Qaneryaram Qairi imangqertuq suunek yuuyaraq pitekluku KYUK-am qemaggvianek tegganret interview-atni.</h2>
					<h2 className='yugtatun'>The Waves of Wisdom collection comes from the KYUK Archives consisting of elder interviews concerning cultural knowledge.</h2>
				</Container>
				<Divider />
				<Container>
					<h1 className='yugtun'>QQ-am Suut Allakaryarat</h1>
					<h1 className='yugtatun'>WoW Video Categories</h1>
					<Grid container columns={2}>{categories}</Grid>
					<Button color='orange'>Tamarmeng Allakaryarat<br /><em>All Categories</em></Button>
				</Container>
				<Divider />
				<Container>
				Black Separator
				</Container>
				<Divider />
				<Container>
					<h1 className='yugtun'>Suut Assikenrulriit</h1>
					<h1 className='yugtatun'>Popular (Most Liked) Videos</h1>
					<Grid container>{popularVideos}</Grid>
					<Button color='orange'>Cali Allat<br /><em>See More</em></Button>
				</Container>

			</div>
		);
	}
}
export default Home;