import React, { Component } from 'react'
import { Table, Image } from 'react-bootstrap'
import { withRouter, BrowserRouter, Link } from 'react-router-dom'

export default class ListOfSeasonEpisodes extends Component {
   constructor(props) {
      super(props);

      this.initialState = {
         apiResult: '',
         error: '',
      }
      this.state = this.initialState;
   }

   fetchSeasonInfo = what => {
      const { params } = this.props.match
      let { imdbIdSeason } = params
      if (imdbIdSeason) {
         const components = imdbIdSeason.split(":")
         if (components.length == 2) {
            const imdbID = components[0]
            const season = components[1]
            const baseUrl = 'http://www.omdbapi.com/?'
            let urlComponents = {
               'apikey': '1e9e9365',
               'i': imdbID,
               'Season': season,
            };
            let urlElements = []
            for (var key in urlComponents) {
               if (urlComponents.hasOwnProperty(key)) {
                  urlElements.push(key + '=' + encodeURIComponent(urlComponents[key]))
               }
            }
            const url = baseUrl + urlElements.join('&');
            fetch(url)
               .then(result => result.json())
               .then(result => {
                  this.setState({
                     apiResult: result
                  })
               })
         } else {
            this.error = "Invalid URL request"
         }
      }
   }

   // Code is invoked after the component is mounted/inserted into the DOM tree.
   componentDidMount() {
      this.fetchSeasonInfo()
   }

   render() {
      const { params } = this.props.match
      /*
            if (this.state.refresh !== true && this.state.searchTitle !== params.searchTitle) {
               this.setState({ refresh: true })
               this.searchForTvShows()
            }
      */
      const { apiResult, error } = this.state
      let episodeList = ""
      let errorStr = ''
      if (this.state)
         if (apiResult !== "") {
            if (apiResult.Response === "True") {
               let episodes = apiResult.Episodes
               episodeList = []
               if (episodes !== undefined) {
                  episodeList = episodes.map((episode, index) => {
//                     return 
                     return <tr imdbId={episode.imdbID} key={index}>
                           <td width="1px">{index + 1}</td>
                           <td><Link to={`/episode/${episode.imdbID}`}>{episode.Title}</Link></td>
                           <td class="text-nowrap">{episode.Released}</td>
                        </tr>
//                     </Link>
                  })
               } else {
                  errorStr = "No episode found"
               }
            } else if (apiResult.Error) {
               errorStr = "Error calling API: " + apiResult.Error
            } else {
               errorStr = "Unknown error"
            }
         }

      if (episodeList === "" || errorStr !== '') {
         errorStr = <div>{errorStr}</div>
      }

      return (
         <div className="container">
            {errorStr}
            <Table class="table table-sm" variant="dark">
               <thead>
                  <tr>
                     <th>#</th>
                     <th>Title</th>
                     <th>Realeased</th>
                  </tr>
               </thead>
               <tbody>
                  {episodeList}
               </tbody>
            </Table>
         </div>
      )
   }
}
