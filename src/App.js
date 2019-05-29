import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown, Image } from 'react-bootstrap'
import { Route, NavLink, BrowserRouter as Router, Switch } from 'react-router-dom'
import './App.css';
import ListOfShows from './ListOfShows'
import SearchForm from './SearchForm';
import Home from './Home';
import Notfound from './NotFound'

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
               <Navbar bg="dark">
                  <Navbar.Brand href="#home"><img
                     src="fmnm_blue.png"
                     width="32"
                     height="32"
                     className="d-inline-block align-top"
                     alt="React Bootstrap logo" />
                  </Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <SearchForm />>
               <NavDropdown title="More" bg="dark" id="basic-nav-dropdown">
                     <NavDropdown.Item href="#home">Home</NavDropdown.Item>
                     <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                  </NavDropdown>
               </Navbar>
               <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/shows/:searchTitle" component={ListOfShows} />
                  <Route component={Notfound} />
               </Switch>
            </div>
         </Router>
      );
   }
}

export default App;
