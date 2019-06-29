import React, { Component } from 'react'
import { Table, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { buildTmdbApiUrlFromComponents, buildTmdbUrlForImagePathAndSize, handleImageError } from './Urls'

class ListOfShows extends Component {
   constructor(props) {
      super(props);

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
         const url = buildTmdbApiUrlFromComponents({
            'query': searchTitle.trim(),
         }, true)
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
         let shows = apiResult.results
         showList = []
         if (shows !== undefined && apiResult.total_results ) {
            showList = shows.map((show, index) => {
               let poster = buildTmdbUrlForImagePathAndSize(show.backdrop_path)
               return <tr imdbId={show.id} key={index} onClick={this.handleSelectShow}>
                  <td width="1px"><Link to={`/show/${show.id}`}>{index + 1}</Link></td>
                  <td><Link to={`/show/${show.id}`}><Image height="75px" onError={handleImageError} src={poster} /></Link></td>
                  <td><Link to={`/show/${show.id}`}>{show.name}</Link></td>
                  <td class="text-nowrap"><Link to={`/show/${show.id}`}>{show.first_air_date}</Link></td>
               </tr>
            })
         } else {
            error = "No show found"
         }
      } else if (apiResult.Error) {
         error = "Error calling API: " + apiResult.Error
      } else {
         // error = "Unknown error"
      }

      let header = ""
      if (showList !== "" && error === '') {
         header = "Found " + apiResult.total_results + " matches."
         showList = <Table class="table" size="sm" variant="dark">
            <thead>
               <tr>
                  <th>#</th>
                  <th></th>
                  <th>Title</th>
                  <th>First Aired</th>
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
