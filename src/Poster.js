import React, { Component } from 'react'
import { Image } from 'react-bootstrap'
import { handleImageError } from './Urls'

export default class Poster extends Component {
   render() {
      const { params } = this.props.match
      let { encodedUri } = params
      let posterImage = ''
      if (encodedUri) {
         let uri = decodeURIComponent(encodedUri)
         posterImage = <Image src={uri} onError={handleImageError} />
      }

      return (
         <div class="d-flex justify-content-center">
            {posterImage}
         </div>
      )
   }
}
