import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, Table , Image} from 'react-bootstrap'
import './App.css';

class App extends Component {
   constructor(props) {
      super(props);
      // the following needed otherwise handleFormSubmit doesn't have a this
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.handleSelectShow = this.handleSelectShow.bind(this);

      this.initialState = {
         searchTitle: '',
         searchYear: '',
         searchPage: '',   // the omdb API only returns 10 entries at a time per "page"
         
         data: [],
         curTime: null
      }
      this.state = this.initialState;
   }

   searchForTvShows = what => {
      let { searchTitle, searchYear } = this.state
      if (searchTitle) {
         if (!searchYear) {
            searchYear = 2018
         }
         // const url = 'http://www.omdbapi.com/?i=tt11111&Season=1&apikey=1e9e9365'
         //const url = 'http://www.omdbapi.com/?i=tt4061080&Season=1&apikey=1e9e9365'
         const baseUrl = 'http://www.omdbapi.com/?'
         let urlComponents = {
            'apikey': '1e9e9365',
            'type': 'series',
            'year': searchYear,
            's': searchTitle,
         };
         let urlElements = []
         for (var key in urlComponents) {
            if (urlComponents.hasOwnProperty(key)) {
               urlElements.push(key + '=' + encodeURIComponent(urlComponents[key]))
            }
         }
         let url = baseUrl + urlElements.join('&');
         fetch(url)
            .then(result => result.json())
            .then(result => {
               this.setState({
                  data: result
               })
            })
      }
      this.setState({
         curTime: new Date().toLocaleString()
      })
   }
   // Code is invoked after the component is mounted/inserted into the DOM tree.
   componentDidMount() {
      this.searchForTvShows()
   }

   handleFormSubmit = event => {
      event.preventDefault()
      this.searchForTvShows(this.state.searchTitle)
   }

   handleChange = event => {
      const { name, value } = event.target;

      this.setState({
         [name]: value
      });
   }

   handleSelectShow = e => {
      const imdbID = e.target.parentElement.getAttribute('imdbid');
      console.log('We need to get the details for ', imdbID);
      alert(imdbID)
   }

   render() {
      const { data } = this.state
      const shows = data.Search
      let totalShows = 0
      let result = []
      if (shows !== undefined) {
         let showNumber = 0
         result = shows.map((show, index) => {
            return <tr imdbId={show.imdbID} data-item={show.imdbId} key={index} onClick={this.handleSelectShow}>
               <td>{index+1}</td>
               <td><Image height="75px" src={show.Poster}/></td>
               <td>{show.Title}</td>
               <td>{show.Year}</td>
               </tr>
         })
         totalShows = data.totalResults
      } else if (data.Error !== undefined) {
         result = "API error: " + data.Error
      }
      let header = "Results of search (" + totalShows + ")"

      let date = new Date()
      return (
         <div>
            <Navbar bg="dark">
               <Navbar.Brand href="#home"><img
        src="fmnm_blue.png"
        width="32"
        height="32"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"/>
      </Navbar.Brand>
               <Navbar.Toggle aria-controls="basic-navbar-nav" />
               <Form onSubmit={this.handleFormSubmit.bind(this)} inline>
                  <FormControl onChange={this.handleChange} bg="dark" type="text" name="searchTitle" placeholder="Search TV show"
                     className_="mr-sm-2" />
               </Form>
               <NavDropdown title="More" bg="dark" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#home">Home</NavDropdown.Item>
                  <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
               </NavDropdown>
            </Navbar>
            <div><b>{header}</b></div>
            <Table variant="dark">{result}</Table>
         </div>
      );
   }
}

export default App;
