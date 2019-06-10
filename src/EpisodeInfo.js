import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
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
            /*
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
                       */
            //            episodeCard = <div><Image height="200px" src={episodeInfo.Poster}/>{episodeCard}</div>
            const cardTextItems = ['Season', 'Episode', 'Year', 'Rated', 'Released', 'Plot', 'Actors', 'Director', 'Language', 'imdbRating']
            const cardText = cardTextItems.map((item) => {
               return <div> <b>{item}:</b> <i>{episodeInfo[item]}</i><br /></div>
            })
            episodeCard = <Card bg="dark" text="white" >
               <Card.Img variant="top" class="poster-image mx-auto d-block img-responsive" onError={handleImageError} src={episodeInfo.Poster} />
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
