import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import Gallery from 'react-grid-gallery'
import { Link } from 'react-router-dom'
import { buildTmdbApiUrlForPersonInformation, buildTmdbUrlForImagePathAndSize, handleImageError } from './Urls'

export default class PersonInfo extends Component {
   constructor(props) {
      super(props);

      this.initialState = {
         apiResult: '',
      }
      this.state = this.initialState;
   }

   fetchPersonInfo = what => {
      const { params } = this.props.match
      let { personId } = params
      if (personId) {
         const url = buildTmdbApiUrlForPersonInformation(personId)
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
      this.fetchPersonInfo()
   }

   render() {
      const { apiResult } = this.state
      let personCard = ""
      let error = ''
      if (apiResult !== "") {
         let personInfo = apiResult
         const cardTextItems = [
            { key: 'overview', label: 'Plot' },
            { key: 'birthday', label: 'Born' },
            { key: 'deathday', label: 'Passed' },
            { key: 'place_of_birth', label: 'Place of birth' },
            { key: 'biography', label: 'Bio' },
            { key: 'homepage', label: 'Official Site', url: true },
            { key: 'popularity', label: 'Popularity' },
            { key: 'known_for_department', label: 'Known For' },
         ]
         const cardText = cardTextItems.map((item) => {
            let label = item.label
            let value = personInfo[item.key]
            if (value) {
               if (item.url) {
                  value = <a href={value}>Go to {label}</a>
               }
               return <div> <b>{label}:</b> <i>{value}</i><br /></div>
            } else {
               return ""
            }
         })

         // list of shows (from credits)
         let listOfShows = []
         let numberOfShows = 0
         if (personInfo.tv_credits) {
            let shows = personInfo.tv_credits.cast
            if (shows) {
               listOfShows = shows.map((show) => {
                  numberOfShows++
                  let poster = buildTmdbUrlForImagePathAndSize(show.poster_path, "w45")
                  let linkToShow = "/show/" + show.id
                  let character = show.character ? <div><i>{show.character}</i></div> : ""
                  return <tr>
                     <td><Link to={linkToShow}><img alt="poster of show:{show.name}" src={poster} /></Link></td>
                     <td><Link to={linkToShow}><b>{show.name}</b></Link>{character}</td>
                  </tr>
               })
            }
         }

         // list of Images
         let imageGallery = ""
         if (personInfo.images) {
            let images = personInfo.images.profiles
            if (images) {
               let listOfImages = images.map((image) => {
                  let small = buildTmdbUrlForImagePathAndSize(image.file_path, "w92")
                  let large = buildTmdbUrlForImagePathAndSize(image.file_path, "original")
                  return {
                     src: large,
                     thumbnail: small,
                     thumbnailWidth: image.width / 16,
                     thumbnailHeight: image.height / 16,
                  }
               })
               imageGallery = <Gallery images={listOfImages} enableImageSelection={false} />
            }
         }

         const posterImage = buildTmdbUrlForImagePathAndSize(personInfo.profile_path)
         let posterImageEncodedUri = encodeURIComponent(posterImage)
         personCard = <Card bg="dark" text="white" >
            <Link to={`/poster/${posterImageEncodedUri}`}>
               <Card.Img variant="top" class="poster-image mx-auto d-block" onError={handleImageError} src={posterImage} />
            </Link>
            <Card.Body>
               <Card.Title>{personInfo.name}</Card.Title>
               <Card.Text>
                  {cardText}
                  <br />
                  <b>TV Acting ({numberOfShows} credits)</b>:
                  <div>
                     <table>
                        {listOfShows}
                     </table>
                  </div>
                  <br />
                  <b>Images</b>:
                  {imageGallery}
                  <br />
               </Card.Text>
            </Card.Body>
         </Card >
      } else if (apiResult.Error) {
         error = "Error calling API: " + apiResult.Error
      } else {
         // error = "Unknown error"
      }

      if (personCard === "" || error !== '') {
         personCard = error
      }

      return (
         <div className="container">
            {personCard}
         </div>
      )
   }
}
