import React, { Component } from 'react'
import { Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { buildOmdbApiUrlFromComponents, handleImageError } from './Urls'
import './ShowInfo.css'

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
         const url = buildOmdbApiUrlFromComponents({ 'i': imdbId })
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
      const { apiResult } = this.state
      let showCard = ""
      let error = ''
      if (apiResult !== "") {
         if (apiResult.Response === "True") {
            let showInfo = apiResult
            /*
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
            */
            const cardTextItems = ['Year', 'Rated', 'Released', 'Genre', 'Plot', 'Actors', 'Language', 'imdbRating'];
            const cardText = cardTextItems.map((item) => {
               return <div> <b>{item}:</b> <i>{showInfo[item]}</i><br /></div>
            })
            const totalSeasons = showInfo.totalSeasons;
            let listOfSeasons = []
            for (let season = 1; season <= totalSeasons; season++) {
               listOfSeasons.push(<Link to={`/season/${showInfo.imdbID}:${season}`}><span ><Badge variant="secondary">Season {season}</Badge> </span></Link>)
            }
            const posterImage = showInfo.Poster && showInfo.Poster !== 'N/A' ? showInfo.Poster : "/no-poster.png"
            let posterImageEncodedUri = encodeURIComponent(posterImage)
            showCard = <Card bg="dark" text="white" >
               <Link to={`/poster/${posterImageEncodedUri}`}>
                  <Card.Img variant="top" class="poster-image mx-auto d-block" onError={handleImageError} src={posterImage} />
               </Link>
               <Card.Body>
                  <Card.Title>{showInfo.Title}</Card.Title>
                  <Card.Text>
                     {cardText}
                     <br />
                     <b>{totalSeasons} Seasons:</b>
                     <div>
                        {listOfSeasons}
                     </div>
                  </Card.Text>
               </Card.Body>
            </Card >
         } else if (apiResult.Error) {
            error = "Error calling API: " + apiResult.Error
         } else {
            error = "Unknown error"
         }
      }
      if (showCard === "" || error !== '') {
         showCard = error
      }

      return (
         <div className="container">
            {showCard}
         </div>
      )
   }
}
