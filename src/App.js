import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown, Image } from 'react-bootstrap'
import { Route, NavLink, BrowserRouter as Router, Switch } from 'react-router-dom'
import './App.css';
import ListOfShows from './ListOfShows'
import ShowInfo from './ShowInfo'
import SearchForm from './SearchForm';
import Home from './Home';
import Notfound from './NotFound'
import history from './history'

class App extends Component {
   constructor(props) {
      super(props);

      this.initialState = {
         searchTitle: '',
         searchYear: '',
         searchPage: '',   // the omdb API only returns 10 entries at a time per "page"
         data: [],
         curTime: null
      }
      this.state = this.initialState;
   }

   render() {
      return (
         <Router>
            <div className="container">
               <Navbar expand="lg" bg="black">
                  <Navbar.Brand href="/"><img
                     src="/fmnm_blue.png"
                     width="32"
                     height="32"
                     className="d-inline-block align-top"
                     alt="React Bootstrap logo" />
                  </Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <SearchForm history={this.props.history}/>
               <NavDropdown title="More" bg="dark" id="basic-nav-dropdown">
                     <NavDropdown.Item href="/">Home</NavDropdown.Item>
                     <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                  </NavDropdown>
               </Navbar>
               <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/shows/:searchTitle" component={ListOfShows} />
                  <Route path="/show/:imdbId" component={ShowInfo} />
                  <Route component={Notfound} />
               </Switch>
            </div>
         </Router>
      );
   }
}

export default App;
