import React, { Component } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import './App.css';
import ListOfShows from './ListOfShows'
import ListOfSeasonEpisodes from './ListOfSeasonEpisodes'
import Poster from './Poster'
import ShowInfo from './ShowInfo'
import EpisodeInfo from './EpisodeInfo'
import SearchForm from './SearchForm'
import Home from './Home';
import Notfound from './NotFound'
// import history from './history'

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
               <Navbar className="justify-content-between" expand="xl" bg="black">
                  <Container>
                     <Navbar.Brand href="/"><img
                        src="/fmnm_blue.png"
                        width="32"
                        height="32"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo" />
                     </Navbar.Brand>
                     <SearchForm history={this.props.history} />
                     <Navbar.Toggle aria-controls="basic-navbar-nav" />
                     <Navbar.Collapse id="basic-navbar-nav">
                           <Nav.Link href="/">Home</Nav.Link>
                           <Nav.Link href="/profile">Profile</Nav.Link>
                     </Navbar.Collapse>
                  </Container>
               </Navbar>
               <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/shows/:searchTitle" component={ListOfShows} />
                  <Route path="/show/:imdbId" component={ShowInfo} />
                  <Route path="/season/:imdbIdSeason" component={ListOfSeasonEpisodes} />
                  <Route path="/episode/:imdbId" component={EpisodeInfo} />
                  <Route path="/poster/:encodedUri" component={Poster} />
                  <Route component={Notfound} />
               </Switch>
            </div>
         </Router>
      );
   }
}

export default App;
