import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { buildTmdbApiUrlForShowInformation, buildTmdbUrlForImagePathAndSize, handleImageError } from './Urls'

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
      let { idSeasonEpisode } = params
      if (idSeasonEpisode) {
         const components = idSeasonEpisode.split(":")
         if (components.length === 3) {
            const id = components[0]
            const season = components[1]
            const episode = components[2]
            const url = buildTmdbApiUrlForShowInformation(id, season, episode)
            fetch(url)
               .then(result => result.json())
               .then(result => {
                  this.setState({
                     apiResult: result
                  })
               })
         }
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
         let episodeInfo = apiResult
         const cardTextItems = [
            { key: 'overview', label: 'Plot' },
            { key: 'season_number', label: 'Season #' },
            { key: 'episode_number', label: 'Espisode #' },
            { key: 'air_date', label: 'Air Date' },
            { key: 'vote_average', label: 'Rating' }
         ]

         const cardText = cardTextItems.map((item) => {
            let label = item.label
            let value = episodeInfo[item.key]
            return <div> <b>{label}:</b> <i>{value}</i><br /></div>
         })

         const posterImage = buildTmdbUrlForImagePathAndSize(episodeInfo.still_path)
         let posterImageEncodedUri = encodeURIComponent(posterImage)
         episodeCard = <Card bg="dark" text="white" >
            <Link to={`/poster/${posterImageEncodedUri}`}>
               <Card.Img variant="top" class="poster-image mx-auto d-block img-responsive" onError={handleImageError} src={posterImage} />
            </Link>
            <Card.Body>
               <Card.Title>"{episodeInfo.name}"</Card.Title>
               <Card.Text>
                  {cardText}
               </Card.Text>
            </Card.Body>
         </Card>

      } else if (apiResult.Error) {
         error = "Error calling API: " + apiResult.Error
      } else {
         // error = "Unknown error"
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
