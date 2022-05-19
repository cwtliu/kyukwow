    import React, {Component} from 'react';
    import { NavLink, Switch, Route, Link } from 'react-router-dom';
    import { Container, Header, Button, Icon, Divider, Image, Grid, Menu } from 'semantic-ui-react';
    import Home from './components/Home.js';
    import Collections from './components/Collections.js';
    import Category from './components/Category.js';
    import Video from './components/Video.js';
    import 'semantic-ui-css/semantic.min.css'
    import './App.css';
    
    export const API_URL = "https://yugtun-api.herokuapp.com";

    // const customFont = 'var(--secondaryHeadlineFont),Arial,Helvetica,sans-serif;'


    // const Navigation = () => (
    //   <Menu inverted>
    //     <Menu.Item
    //       name='home'
    //       active={activeItem === 'home'}
    //       onClick={this.handleItemClick}
    //     />
    //     <Menu.Item
    //       name='categories'
    //       active={activeItem === 'categories'}
    //       onClick={this.handleItemClick}
    //     />
    //   </Menu>
    // );

    const Main = () => (
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/collections' component={Collections}></Route>
        <Route exact path='/category/:word' component={Category}></Route>
        <Route exact path='/video/:word' component={Video}></Route>
      </Switch>
    );

    
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          count:0,
          activeItem: 'home',
        };
      }

      handleItemClick = (e, { name, id }) => {
        this.setState({ 
          activeItem: name, 
        })
      }

      render() {
        const { activeItem } = this.state
        return(
        <div className='app'>
          <div style={{display:'flex',justifyContent:'flex-start',color:'#333333',alignItems:'center',flexDirection:'row'}}>
          <span><Image style={{width:'120px'}} src="/images/npr.brightspotcdn.webp" /></span>
          <div style={{display:'flex',flexDirection:'column',marginLeft:'15px'}}>
          <span style={{fontSize:'16px',fontFamily:"'Roboto', Arial, Helvetica"}}>Ciuliamta Paiciutait</span>
          <span style={{fontStyle:'italic',fontSize:'16px',fontFamily:"'Roboto',Arial, Helvetica"}}>Our Ancestors' Legacy</span>
          </div>
          </div>

          <Menu style={{background:'#4a565f'}}>
            <Menu.Item
              style={{color:'white'}}
              name='home'
              id='0'
              active={activeItem === 'home'}
              onClick={this.handleItemClick}
            >
            <NavLink style={{color:'white'}} to='/'>Home</NavLink>
            </Menu.Item>
            <Menu.Item
              style={{color:'white'}}
              name='categories'
              id='1'
              active={activeItem === 'categories'}
              onClick={this.handleItemClick}
            >
            <NavLink style={{color:'white'}} to='/collections'>Categories</NavLink>
            </Menu.Item>
          </Menu>

          <Main />
        </div>
        );
      }
    };

    export default App;
