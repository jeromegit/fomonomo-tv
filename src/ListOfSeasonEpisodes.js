import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { buildOmdbApiUrlFromComponents } from './Urls'

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
         if (components.length === 2) {
            const imdbID = components[0]
            const season = components[1]
            const url = buildOmdbApiUrlFromComponents({
               'i': imdbID,
               'Season': season,
            });
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
      const { apiResult } = this.state
      let episodeList = ""
      let errorStr = ''
      if (this.state)
         if (apiResult !== "") {
            if (apiResult.Response === "True") {
               let episodes = apiResult.Episodes
               episodeList = []
               if (episodes !== undefined) {
                  episodeList = episodes.map((episode, index) => {
                     return <tr imdbId={episode.imdbID} key={index}>
                        <td width="1px">{index + 1}</td>
                        <td><Link to={`/episode/${episode.imdbID}`}>{episode.Title}</Link></td>
                        <td class="text-nowrap">{episode.Released}</td>
                     </tr>
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
      } else {
         episodeList = <div>Episode list for "{apiResult.Title}". Season {apiResult.Season}
            <Table class="table" size="sm" variant="dark">
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
      }

      return (
         <div className="container">
            {errorStr}
            {episodeList}
         </div>
      )
   }
}
