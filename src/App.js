import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, Table, Image } from 'react-bootstrap'
import './App.css';
import ListOfShows from './ListOfShows'
import Publish from './Publish'

class App extends Component {
   constructor(props) {
      super(props);
      // the following needed otherwise handleFormSubmit doesn't have a this
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      
      this.initialState = {
         searchTitle: '',
         searchYear: '',
         searchPage: '',   // the omdb API only returns 10 entries at a time per "page"
         data: [],
         curTime: null
      }
      this.state = this.initialState;
   }


   handleFormSubmit = event => {
      event.preventDefault()

     ListOfShows.prototype.searchForTvShows(this.state.searchTitle)
   }

   handleChange = event => {
      const { name, value } = event.target;

      this.setState({
         [name]: value
      });
   }

   
   render() {
      return (
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
               <Form href="#search" onSubmit={ListOfShows.prototype.onSubmitSearch} inline>
                  <FormControl onChange={this.handleChange} bg="dark" type="text" name="searchTitle" placeholder="Search TV show"
                     className_="mr-sm-2" />
               </Form>
               <NavDropdown title="More" bg="dark" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#home">Home</NavDropdown.Item>
                  <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
               </NavDropdown>
            </Navbar>
            <div><b>HOME!</b></div>
            <ListOfShows searchTitle={this.state.searchTitle}/>
         </div>
      );
   }
}

export default App;
