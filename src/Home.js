import React from 'react'
import "./Home.css"

export default class Home extends React.Component {
   render() {
      //   const tmdb_logo = '/no-poster.png'
      const tmdb_logo = 'https://www.themoviedb.org/assets/2/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png'
      return (
         <div className="lander">
            <h1>FoMoNoMo TV</h1>
            <p>Never miss your favorite TV shows again</p>
            <div class="tmdb_logo">
               <table cellPadding="3">
                  <tr>
                     <td><img class="tmdb_img_logo" alt="TMDB Logo" src={tmdb_logo} /></td>
                     <td align="left">This product uses the TMDb API but is not endorsed or certified by TMDb</td>
                  </tr>
               </table>
            </div>
         </div>
      );

   }
}
