import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { buildTmdbApiUrlForShowInformation } from './Urls'

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
      let { idSeason } = params
      if (idSeason) {
         const components = idSeason.split(":")
         if (components.length === 2) {
            const id = components[0]
            const season = components[1]
            const url = buildTmdbApiUrlForShowInformation(id, season)
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
            let episodes = apiResult.episodes
            episodeList = []
            if (episodes !== undefined) {
               episodeList = episodes.map((episode, index) => {
                  let episode_composite_id = [episode.show_id, episode.season_number, episode.episode_number].join(":")
                  return <tr id={episode.episode_number} key={index}>
                     <td width="1px">{index + 1}</td>
                     <td><Link to={`/episode/${episode_composite_id}`}>{episode.name}</Link></td>
                     <td>{episode.vote_average}</td>
                     <td class="text-nowrap">{episode.air_date}</td>
                  </tr>
               })
            } else {
               errorStr = "No episode found"
            }
         } else if (apiResult.Error) {
            errorStr = "Error calling API: " + apiResult.Error
         } else {
            // errorStr = "Unknown error"
         }

      if (episodeList === "" || errorStr !== '') {
         errorStr = <div>{errorStr}</div>
      } else {
         episodeList = <div>Episode list for "{apiResult.name}"
            <Table class="table" size="sm" variant="dark">
               <thead>
                  <tr>
                     <th>#</th>
                     <th>Title</th>
                     <th>Rating</th>
                     <th>Released</th>
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
