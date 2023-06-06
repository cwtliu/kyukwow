    import React, {Component} from 'react';
    import { NavLink, Switch, Route, Link } from 'react-router-dom';
    import { Container, Header, Button, Icon, Divider, Image, Grid, Menu, Checkbox, Dropdown, Popup } from 'semantic-ui-react';
    import Home from './components/Home.js';
    import CategoryLibrary from './components/CategoryLibrary.js';
    import Category from './components/Category.js';
    import Video from './components/Video.js';
    import Browse from './components/Browse.js';
    import About from './components/About.js';
    import 'semantic-ui-css/semantic.min.css'
    import './App.css';
    import { LazyLoadImage } from 'react-lazy-load-image-component';
    import 'react-lazy-load-image-component/src/effects/blur.css';
    import ReactGA from "react-ga4";
    // export const API_URL = "http://localhost:5000";
    // export const WEB_URL = "http://localhost:3000";
    // export const WEB_URL = "http://inupiaqonline.com/kyukwow";
    // export const API_URL = "https://inupiaqonline.com/api";
    ReactGA.initialize("G-JZB9CXH4GJ")

    //export const API_URL = "http://localhost:5000";
    //export const WEB_URL = "http://localhost:3000";
     export const WEB_URL = "http://kyukwow.inupiaqonline.com";
     export const API_URL = "https://inupiaqonline.com/api";

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
            <div style={{flex:1,display:'flex',justifyContent:'flex-start',color:'#333333',alignItems:'center',flexDirection:'row',height:'55px'}}>
            <span><Link to='/'><LazyLoadImage effect='opacity' width={'120px'}  style={{width:'120px',}} src={WEB_URL+"/images/npr.brightspotcdn.webp"} /></Link></span>
            <div style={{display:'flex',flexDirection:'column',marginLeft:'15px'}}>
            <span style={{fontSize:'16px',fontFamily:"'Roboto', Arial, Helvetica"}}>Ciuliamta Paiciutait</span>
            <span style={{fontStyle:'italic',fontSize:'16px',fontFamily:"'Roboto',Arial, Helvetica"}}>Our Ancestors' Legacy</span>
            </div>

            {this.state.innerWidth < 480 ?
              null
              :
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
              <span style={{fontSize:'16px',color:'grey',paddingRight:'15px',fontWeight:'400',lineHeight:'23px',paddingBottom:'4px',fontFamily:"'Roboto', Arial, Helvetica"}}>Erinairaqainaq

              <Popup
                trigger={<Icon style={{color:'#d4d4d4',width:'22px',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'
                content={<div style={{fontSize:'16px'}}>{'Audio Only'}</div>}
                position='bottom'
              />
              </span>
              <Checkbox toggle checked={this.state.audioOnly} onClick={()=>{this.setState({audioOnly:!this.state.audioOnly})}} />
              </div>
            }

          </div>
          </div>


          <Menu style={{background:'#4a565f',marginTop:'5px'}}>
            <Link to='/'>
              <Menu.Item
                style={{color:'white',textAlign:'center',lineHeight:'18px'}}
                name='home'
                id='0'
                active={activeItem === 'home'}
              >
              Suuliaret Ayagnerat
              </Menu.Item>
            </Link>
            <Link to='/categorylibrary'>
              <Menu.Item
                style={{color:'white',textAlign:'center',lineHeight:'18px'}}
                name='categories'
                id='1'
                active={activeItem === 'categories'}
              >
              Ayuqenrilnguut Imait
              </Menu.Item>
            </Link>
            <Dropdown style={{color:'white',textAlign:'center',lineHeight:'18px'}} item text='Allat'>
              <Dropdown.Menu direction='left' style={{zIndex:3000}}>
                <Link to='/browse'>
                <Dropdown.Item>
                Suuliaret Yuvriallerkarviat
                </Dropdown.Item>
                </Link>
                <Link to='/about'>
                <Dropdown.Item>
                Wangkuta
                </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            </Dropdown>
            <div style={{display:'flex',alignItems:'center'}}>
              <Popup
                
                trigger={<Icon style={{fontSize:'20px',color:'white',width:'22px',paddingLeft:'3px'}} link name='comment alternate outline'>{'\n'}</Icon>}
                on='click'

            content={
              <div>
              <div style={{display:'flex',fontSize:'14px'}}>
              <span style={{flex:1,color:'#00000099'}}>{'Suuliaret Ayagnerat'}</span>
              <span style={{flex:1,display:'flex',alignItems:'center',marginLeft:'5px'}}>
              <span>{'Home'}</span>
              </span>
              </div>
              <div style={{display:'flex',fontSize:'14px',paddingTop:'3px',marginTop:'4px',borderTop: '1px solid #f4f3f3' }}>
              <span style={{flex:1,color:'#00000099'}}>{'Ayuqenrilnguut Imait'}</span>
              <span style={{flex:1,display:'flex',alignItems:'center',marginLeft:'5px'}}>
              <span>{'Categories'}</span>
              </span>
              </div>
              <div style={{display:'flex',fontSize:'14px',paddingTop:'3px',marginTop:'4px',borderTop: '1px solid #f4f3f3' }}>
              <span style={{flex:1,color:'#00000099'}}>{'Allat'}</span>
              <span style={{flex:1,display:'flex',alignItems:'center',marginLeft:'5px'}}>
              <span>{'Others'}</span>
              </span>
              </div>
              <div style={{display:'flex',fontSize:'14px',paddingTop:'3px',marginTop:'4px',borderTop: '1px solid #f4f3f3' }}>
              <span style={{flex:1,color:'#00000099'}}>{'Suuliaret Yuvriallerkarviat'}</span>
              <span style={{flex:1,display:'flex',alignItems:'center',marginLeft:'5px'}}>
              <span>{'Browse Videos'}</span>
              </span>
              </div>
              <div style={{display:'flex',fontSize:'14px',paddingTop:'3px',marginTop:'4px',borderTop: '1px solid #f4f3f3' }}>
              <span style={{flex:1,color:'#00000099'}}>{'Wangkuta'}</span>
              <span style={{flex:1,display:'flex',alignItems:'center',marginLeft:'5px'}}>
              <span>{'All Of Us'}</span>
              </span>
              </div>              
              </div>
            }

                position='bottom left'
              />
            </div>



          </Menu>

          <Switch>
            <Route exact path='/' render={(props) => <Home {...props} innerWidth={this.state.innerWidth} />} />>
            <Route exact path='/categorylibrary' component={CategoryLibrary}></Route>
            <Route exact path='/browse' component={Browse}></Route>
            <Route exact path='/about' component={About}></Route>
            <Route exact path='/category/:word' render={(props) => <Category {...props} innerWidth={this.state.innerWidth} />} />>
            <Route exact path='/video/:word' render={(props) => <Video {...props} audioHandler={this.audioHandler} audioOnly={this.state.audioOnly} innerHeight={this.state.innerHeight} innerWidth={this.state.innerWidth} />} />>
          </Switch>

        </div>
        );
      }
    };

    export default App;
