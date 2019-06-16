import React, { Component } from 'react'
import { Table, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { buildOmdbApiUrlFromComponents, handleImageError } from './Urls'

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
         const url = buildOmdbApiUrlFromComponents({
            'type': 'series',
            'year': searchYear,
            's': searchTitle.trim(),
         })
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
   }

   handleSelectShow = e => {
      // const imdbID = e.target.parentElement.getAttribute('imdbid');
      // console.log('We need to get the details for ', imdbID);
      // alert('We need to get the details for '+imdbID);
   }

   render() {
      document.activeElement.blur() // make the keyboard disappear
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
                     <td><Link to={`/show/${show.imdbID}`}><Image height="75px" onError={handleImageError} src={poster} /></Link></td>
                     <td><Link to={`/show/${show.imdbID}`}>{show.Title}</Link></td>
                     <td class="text-nowrap"><Link to={`/show/${show.imdbID}`}>{show.Year}</Link></td>
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
         header = "Found " + apiResult.totalResults + " matches."
         showList = <Table class="table" size="sm" variant="dark">
            <thead>
               <tr>
                  <th>#</th>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Years</th>
               </tr>
            </thead>
            <tbody>
               {showList}
            </tbody>
         </Table>

      } else {
         header = error
         showList = ""
      }

      return (
         <div className="container">
            < div><b>{header}</b></div >
            <Table size="sm" variant="dark">{showList}</Table>
         </div>
      )
   }
}
export default ListOfShows
