import React, { Component } from 'react'
import { Table, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default class episodeInfo extends Component {
   constructor(props) {
      super(props);

      this.initialState = {
         apiResult: '',
      }
      this.state = this.initialState;
   }

   fetchEpisodeInfo = what => {
      const { params } = this.props.match
      let { imdbId } = params
      if (imdbId) {
         const baseUrl = 'http://www.omdbapi.com/?'
         let urlComponents = {
            'apikey': '1e9e9365',
            'i': imdbId
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
      this.fetchEpisodeInfo()
   }

   handleSelectSeason = e => {
      const season = e.target.parentElement.getAttribute('season');
      alert("need season:" + season)
   }

   render() {
      const { params } = this.props.match
      const { apiResult } = this.state
      let episodeCard = ""
      let error = ''
      if (apiResult !== "") {
         if (apiResult.Response === "True") {
            let episodeInfo = apiResult
            let topItems = ['Title', 'Season', 'Episode', 'Year', 'Rated', 'Released'];
            const episodeCardTop = topItems.map((item) => {
               return <div> <b>{item}:</b> {episodeInfo[item]}<br /></div>
            })
            let bottomItems = ['Plot', 'Actors', 'Director', 'Language', 'imdbRating'];
            const episodeCardBottom = bottomItems.map((item) => {
               return <div> <b>{item}:</b> {episodeInfo[item]}<br /></div>
            })
            episodeCard = <table><tr><td><Image height="180px" width="200px" src={episodeInfo.Poster} /></td><td width="500px">{episodeCardTop}</td></tr>
               <tr><td colSpan="2" valign="top">{episodeCardBottom}</td></tr>
            </table>
            //            episodeCard = <div><Image height="200px" src={episodeInfo.Poster}/>{episodeCard}</div>
         } else if (apiResult.Error) {
            error = "Error calling API: " + apiResult.Error
         } else {
            error = "Unknown error"
         }
      }
      let header = ""
      if (episodeCard !== "" && error === '') {
         header = "Results of search (" + apiResult.totalResults + ")"
      } else {
         header = error
         episodeCard = error
      }

      return (
         <div className="container">
            {episodeCard}
         </div>
      )
   }
}
