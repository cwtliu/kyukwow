    import React, {Component} from 'react';
    import { NavLink, Switch, Route, Link } from 'react-router-dom';
    import { Container, Header, Button, Icon, Divider, Image, Grid, Menu, Checkbox, Dropdown } from 'semantic-ui-react';
    import Home from './components/Home.js';
    import CategoryLibrary from './components/CategoryLibrary.js';
    import Category from './components/Category.js';
    import Video from './components/Video.js';
    import 'semantic-ui-css/semantic.min.css'
    import './App.css';
    // export const API_URL = "https://yugtun-api.herokuapp.com";
    export const API_URL = "http://localhost:5000";
    export const WEB_URL = "http://localhost:3000";
    // export const WEB_URL = "http://inupiaqonline.com/kyukwow"

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

    // export const API_URL = "https://yugtun-api.herokuapp.com";
    // export const API_URL = "https://inupiaqonline.com/api";

    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          count:0,
          activeItem: 'home',
          audioOnly:false,
          innerWidth: document.documentElement.clientWidth,
          innerHeight: document.documentElement.clientHeight,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
        this.audioHandler = this.audioHandler.bind(this)

      }

      componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
      }

      componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
      }

      audioHandler() {
        this.setState({audioOnly:!this.state.audioOnly})
      }

      handleItemClick = (e, { name, id }) => {
        this.setState({ 
          activeItem: name, 
        })
      }

      updateDimensions() {
        this.setState({
          innerWidth: document.documentElement.clientWidth,
          innerHeight: document.documentElement.clientHeight,
        });
      }

      render() {
        const { activeItem } = this.state
        return(
        <div className='app'>


          <div style={{marginLeft:'10px',marginRight:'10px',marginBottom:'0px'}}>
            <div style={{flex:1,display:'flex',justifyContent:'flex-start',color:'#333333',alignItems:'center',flexDirection:'row'}}>
            <span><Image style={{width:'120px'}} src={WEB_URL+"/images/npr.brightspotcdn.webp"} /></span>
            <div style={{display:'flex',flexDirection:'column',marginLeft:'15px'}}>
            <span style={{fontSize:'16px',fontFamily:"'Roboto', Arial, Helvetica"}}>Ciuliamta Paiciutait</span>
            <span style={{fontStyle:'italic',fontSize:'16px',fontFamily:"'Roboto',Arial, Helvetica"}}>Our Ancestors' Legacy</span>
            </div>

            {this.state.innerWidth < 480 ?
              null
              :
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
              <span style={{fontSize:'16px',color:'grey',paddingRight:'15px',fontWeight:'400',lineHeight:'23px',paddingBottom:'4px',fontFamily:"'Roboto', Arial, Helvetica"}}>Audio Only</span>
              <Checkbox toggle checked={this.state.audioOnly} onClick={()=>{this.setState({audioOnly:!this.state.audioOnly})}} />
              </div>
            }

          </div>
          </div>


          <Menu style={{background:'#4a565f',marginTop:'5px'}}>
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
            <NavLink style={{color:'white'}} to='/categorylibrary'>Categories</NavLink>
            </Menu.Item>

            <Dropdown style={{color:'white'}} item text='More'>
              <Dropdown.Menu>
                <Dropdown.Item>Browse All Videos</Dropdown.Item>
                <Dropdown.Item>Contact</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu>

          <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/categorylibrary' component={CategoryLibrary}></Route>
            <Route exact path='/category/:word' component={Category}></Route>
            <Route exact path='/video/:word' render={(props) => <Video {...props} audioHandler={this.audioHandler} audioOnly={this.state.audioOnly} innerHeight={this.state.innerHeight} innerWidth={this.state.innerWidth} />} />>
          </Switch>

        </div>
        );
      }
    };

    export default App;
