    import React, {Component} from 'react';
    import './App.css';
    import { NavLink, Switch, Route } from 'react-router-dom';
    import Home from './components/Home.js';
    import Collections from './components/Collections.js';
    import Category from './components/Category.js';
    import Video from './components/Video.js';
    import 'semantic-ui-css/semantic.min.css'
    
    export const API_URL = "https://yugtun-api.herokuapp.com";

    const Navigation = () => (
      <nav>
        <ul>
          <li><NavLink exact activeClassName="current" to='/'>Home</NavLink></li>
          <li><NavLink exact activeClassName="current" to='/collections'>Collections</NavLink></li>
        </ul>
      </nav>
    );

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
        };
      }
      render() {
        return(
        <div className='app'>
          <h1>KYUK</h1>
          <Navigation />
          <Main />
        </div>
        );
      }
    };

    export default App;
