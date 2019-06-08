import React, { Component } from 'react'
import { Table, Image } from 'react-bootstrap'

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
      this.fetchShowInfo()
   }

   handleSelectSeason = e => {
      const season = e.target.parentElement.getAttribute('season');
      alert("need season:" + season)
   }

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
               return <div> <b>{item}:</b> {showInfo[item]}<br/></div>
            })
            let bottomItems = ['Genre', 'Plot', 'Actors', 'Language', 'imdbRating'];
            const showCardBottom = bottomItems.map((item) => {
               return <div> <b>{item}:</b> {showInfo[item]}<br/></div>
            })
            showCard = <table><tr><td><Image height="180px" src={showInfo.Poster}/></td><td>{showCardTop}</td></tr>
            <tr><td colSpan="2" valign="top">{showCardBottom}</td></tr>
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
