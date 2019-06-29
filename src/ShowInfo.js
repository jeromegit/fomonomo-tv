import React, { Component } from 'react'
import { Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { buildTmdbApiUrlForShowInformation, buildTmdbUrlForImagePathAndSize, handleImageError } from './Urls'
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
      let { id } = params
      if (id) {
         const url = buildTmdbApiUrlForShowInformation(id)
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
         let showInfo = apiResult
         const cardTextItems = [
            { key: 'overview', label: 'Plot' },
            { key: 'first_air_date', label: 'First aired' },
            { key: 'last_air_date', label: 'Last aired' },
            { key: 'number_of_episodes', label: '# episodes' },
            { key: 'homepage', label: 'Homepage', url: true },
            { key: 'popularity', label: 'Popularity' },
            { key: 'vote_average', label: 'Rating' }
         ]
         //         'overview', 'origin_country', 'languages', 'genres', 'networks'
         const cardText = cardTextItems.map((item) => {
            let label = item.label
            let value = showInfo[item.key]
            if (value) {
               if (item.url) {
                  value = <a href={value}>Go to {label}</a>
               }
               return <div> <b>{label}:</b> <i>{value}</i><br /></div>
            } else {
               return ""
            }
         })

         // List of seasons
         const totalSeasons = showInfo.number_of_seasons;
         let listOfSeasons = []
         for (let season = 1; season <= totalSeasons; season++) {
            listOfSeasons.push(<Link to={`/season/${showInfo.id}:${season}`}><span ><Badge variant="secondary">Season {season}</Badge> </span></Link>)
         }

         // Cast (from credits)
         let listOfCast = []
         if (showInfo.credits) {
            let castMembers = showInfo.credits.cast
            if (castMembers) {
               listOfCast = castMembers.map((castMember) => {
                  let castPhoto = buildTmdbUrlForImagePathAndSize(castMember.profile_path, "w45")
                  let linkToCast = "/person/" + castMember.id
                  let character = castMember.character ? <div><i>{castMember.character}</i></div> : ""
                  return <tr>
                     <td><Link to={linkToCast}><img alt="Image of {castMember.name}" src={castPhoto} /></Link></td>
                     <td><Link to={linkToCast}><b>{castMember.name}</b></Link>{character}</td>
                  </tr>
               })
            }
         }
         const posterImage = buildTmdbUrlForImagePathAndSize(showInfo.poster_path)
         let posterImageEncodedUri = encodeURIComponent(posterImage)
         showCard = <Card bg="dark" text="white" >
            <Link to={`/poster/${posterImageEncodedUri}`}>
               <Card.Img variant="top" class="poster-image mx-auto d-block" onError={handleImageError} src={posterImage} />
            </Link>
            <Card.Body>
               <Card.Title>{showInfo.name}</Card.Title>
               <Card.Text>
                  {cardText}
                  <br />
                  <b>Cast</b>:
                  <div>
                     <table>
                        {listOfCast}
                     </table>
                  </div>
                  <br />
                  <b>{totalSeasons} Seasons:</b>
                  <div>
                     {listOfSeasons}
                  </div>
                  <br />
                  <br />
               </Card.Text>
            </Card.Body>
         </Card >
      } else if (apiResult.Error) {
         error = "Error calling API: " + apiResult.Error
      } else {
         // error = "Unknown error"
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
