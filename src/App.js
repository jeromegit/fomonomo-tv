import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap'
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
import PersonInfo from './PersonInfo';

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
               <Navbar className="navbar-light justify-content-between" expand="" bg="black">
                     <Navbar.Brand href="/"><img
                        src="/fmnmtv.png"
                        width="32"
                        height="32"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo" />
                     </Navbar.Brand>
                     <SearchForm history={this.props.history} />
                     <Navbar.Toggle aria-controls="basic-navbar-nav" />
                     <Navbar.Collapse id="basic-navbar-nav">
                           <Nav.Link href="/">Home</Nav.Link>
                     </Navbar.Collapse>
               </Navbar>
               <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/shows/:searchTitle" component={ListOfShows} />
                  <Route path="/show/:id" component={ShowInfo} />
                  <Route path="/season/:idSeason" component={ListOfSeasonEpisodes} />
                  <Route path="/episode/:idSeasonEpisode" component={EpisodeInfo} />
                  <Route path="/poster/:encodedUri" component={Poster} />
                  <Route path="/person/:personId" component={PersonInfo} />
                  <Route component={Notfound} />
               </Switch>
         </Router>
      );
   }
}

export default App;
