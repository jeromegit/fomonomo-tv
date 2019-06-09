import React, { Component } from 'react'
import { Table, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { buildOmdbApiUrlFromComponents } from './Urls'

export default class ShowInfo extends Component {
   constructor(props) {
      super(props);

      this.initialState = {
         apiResult: '',
      }
      this.state = this.initialState;
   }

   fetchShowInfo = what => {
      const { params } = this.props.match
      let { imdbId } = params
      if (imdbId) {
         const url = buildOmdbApiUrlFromComponents({'i': imdbId})
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
      this.fetchShowInfo()
   }

/*
   handleSelectSeason = e => {
      const season = e.target.parentElement.getAttribute('season');
      alert("need season:" + season)
   }
*/
   render() {
      const { params } = this.props.match
      const { apiResult } = this.state
      let showCard = ""
      let error = ''
      if (apiResult !== "") {
         if (apiResult.Response === "True") {
            let showInfo = apiResult
            let topItems = ['Title', 'Year', 'Rated', 'Released'];
            const showCardTop = topItems.map((item) => {
               return <div> <b>{item}:</b> {showInfo[item]}<br /></div>
            })
            let bottomItems = ['Genre', 'Plot', 'Actors', 'Language', 'imdbRating'];
            const showCardBottom = bottomItems.map((item) => {
               return <div> <b>{item}:</b> {showInfo[item]}<br /></div>
            })
            const totalSeasons = showInfo.totalSeasons;
            let listOfSeasons = []
            for(let season=1; season<=totalSeasons; season++) {
               listOfSeasons.push(<li key={season}><Link to={`/season/${showInfo.imdbID}:${season}`}>Season #{season}</Link></li>)
            }
            showCard = <table><tr><td><Image height="180px" src={showInfo.Poster} /></td><td>{showCardTop}</td></tr>
               <tr><td colSpan="2" valign="top">{showCardBottom}</td></tr>
               <tr><td colSpan="2" valign="top"><br/><b>{totalSeasons} Seasons:</b><ul>{listOfSeasons}</ul></td></tr>
            </table>
            //            showCard = <div><Image height="200px" src={showInfo.Poster}/>{showCard}</div>
         } else if (apiResult.Error) {
            error = "Error calling API: " + apiResult.Error
         } else {
            error = "Unknown error"
         }
      }
      let header = ""
      if (showCard !== "" && error === '') {
         header = "Results of search (" + apiResult.totalResults + ")"
      } else {
         header = error
         showCard = error
      }

      return (
         <div className="container">
            {showCard}
         </div>
      )
   }
}
