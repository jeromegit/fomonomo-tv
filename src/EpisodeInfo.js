import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { buildOmdbApiUrlFromComponents, handleImageError } from './Urls'

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
         const url = buildOmdbApiUrlFromComponents({
            'i': imdbId
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
      this.fetchEpisodeInfo()
   }

   render() {
      const { apiResult } = this.state
      let episodeCard = ""
      let error = ''
      if (apiResult !== "") {
         if (apiResult.Response === "True") {
            let episodeInfo = apiResult
            const cardTextItems = ['Season', 'Episode', 'Year', 'Rated', 'Released', 'Plot', 'Actors', 'Director', 'Language', 'imdbRating']
            const cardText = cardTextItems.map((item) => {
               return <div> <b>{item}:</b> <i>{episodeInfo[item]}</i><br /></div>
            })
            let posterImageEncodedUri = encodeURIComponent(episodeInfo.Poster)
            episodeCard = <Card bg="dark" text="white" >
               <Link to={`/poster/${posterImageEncodedUri}`}>
                  <Card.Img variant="top" class="poster-image mx-auto d-block img-responsive" onError={handleImageError} src={episodeInfo.Poster} />
               </Link>
               <Card.Body>
                  <Card.Title>"{episodeInfo.Title}"</Card.Title>
                  <Card.Text>
                     {cardText}
                  </Card.Text>
               </Card.Body>
            </Card>

         } else if (apiResult.Error) {
            error = "Error calling API: " + apiResult.Error
         } else {
            error = "Unknown error"
         }
      }
      if (episodeCard === "" || error !== '') {
         episodeCard = error
      }

      return (
         <div className="container">
            {episodeCard}
         </div>
      )
   }
}
