import React, { Component } from 'react'
import { Table, Image } from 'react-bootstrap'
import { withRouter, BrowserRouter, Link} from 'react-router-dom'

class ListOfShows extends Component {
   constructor(props) {
      super(props);
      // the following needed otherwise handleFormSubmit doesn't have a this
      //this.handleFormSubmit = this.handleFormSubmit.bind(this);
      //      this.onSubmitSearch = this.onSubmitSearch.bind(this);

      this.initialState = {
         searchTitle: '',
         searchYear: '',
         searchPage: '',   // the omdb API only returns 10 entries at a time per "page"
         apiResult: '',
      }
      this.state = this.initialState;
   }

   searchForTvShows = what => {
      const { params } = this.props.match
      let { searchTitle, searchYear } = params
      if (searchTitle && searchTitle !== this.state.searchTitle) {
         if (!searchYear) {
            searchYear = 2018
         }
         this.setState({
            searchTitle: searchTitle,
            searchYear: searchYear,
            refresh: false
         })
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
//         alert("fetching " + searchTitle);
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

   componentDidUpdate() {
      let aa = 0
   }
   handleSelectShow = e => {
      const imdbID = e.target.parentElement.getAttribute('imdbid');
      // console.log('We need to get the details for ', imdbID);
//      alert('We need to get the details for '+imdbID);
   }

   render() {
      const { params } = this.props.match
      if (this.state.refresh !== true && this.state.searchTitle !== params.searchTitle) {
         this.setState({ refresh: true })
         this.searchForTvShows()
      }
      const { apiResult } = this.state
      let showList = ""
      let error = ''
      if (apiResult !== "") {
         if (apiResult.Response === "True") {
            let shows = apiResult.Search
            showList = []
            if (shows !== undefined) {
               showList = shows.map((show, index) => {
                  let poster = show.Poster && show.Poster !== 'N/A' ? show.Poster : "/no-poster.png"
                  return <tr imdbId={show.imdbID} key={index} onClick={this.handleSelectShow}>
                     <td width="1px"><Link to={`/show/${show.imdbID}`}>{index + 1}</Link></td>
                     <td><Link to={`/show/${show.imdbID}`}><Image height="75px" src={poster}/></Link></td>
                     <td><Link to={`/show/${show.imdbID}`}>{show.Title}</Link></td>
                     <td><Link to={`/show/${show.imdbID}`}>{show.Year}</Link></td>
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
            < div><b>{header}</b></div >
            <Table class="table table-sm" variant="dark">{showList}</Table>
         </div>
      )
   }
}
export default ListOfShows
