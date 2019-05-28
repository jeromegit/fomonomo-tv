import React, { Component } from 'react'
import { Table, Image } from 'react-bootstrap'

class ListOfShows extends Component {
   constructor(props) {
      super(props);
      // the following needed otherwise handleFormSubmit doesn't have a this
      //this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.onSubmitSearch = this.onSubmitSearch.bind(this);

      this.initialState = {
         searchTitle: '',
         searchYear: '',
         searchPage: '',   // the omdb API only returns 10 entries at a time per "page"
         apiResult: '',
      }
      this.state = this.initialState;
   }

   onSubmitSearch(event) {
      event.preventDefault();
      let form = event.target
      let searchTitle = form.elements["searchTitle"].value

      alert("search for: " + searchTitle)
      this.searchForTvShows(searchTitle)
   }

   searchForTvShows = what => {
      let { searchTitle, searchYear } = this.state
      if (searchTitle) {
         if (!searchYear) {
            searchYear = 2018
         }
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
                  apiResult: result
               })
            })
      }
   }

   // Code is invoked after the component is mounted/inserted into the DOM tree.
   componentDidMount() {
      this.searchForTvShows()
   }

   handleSelectShow = e => {
      const imdbID = e.target.parentElement.getAttribute('imdbid');
      console.log('We need to get the details for ', imdbID);
      alert(imdbID)
   }

   render() {
      const { apiResult } = this.state
      let showList = ""
      let error = ''
      if (apiResult !== "") {
         if (apiResult.Response === "True") {
            let shows = apiResult.Search
            showList = []
            if (shows !== undefined) {
               showList = shows.map((show, index) => {
                  return <tr imdbId={show.imdbID} key={index} onClick={this.handleSelectShow}>
                     <td>{index + 1}</td>
                     <td><Image height="75px" src={show.Poster} /></td>
                     <td>{show.Title}</td>
                     <td>{show.Year}</td>
                  </tr>
               })
            } else {
               error = "No show found"
            }
         } else if (apiResult.Error) {
            error = "Error calling API: " + apiResult.Error
         } else {
            error = "Unknown error"
         }
      }

      let header = ""
      if (showList !== "" && error === '') {
         header = "Results of search (" + apiResult.totalResults + ")"
      } else {
         header = error
         showList = ""
      }

      return (
         <div className="container">
            < div > <b>{header}</b></div >
            <Table variant="dark">{showList}</Table>
         </div>
      )
   }
}
export default ListOfShows
