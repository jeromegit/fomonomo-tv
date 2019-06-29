const apiKey = '1c40e7b79848bde76ff5b90fe48cff04'

export function buildUrlFromComponents(baseUrl, urlComponents) {
   let urlElements = []
   for (var key in urlComponents) {
      if (urlComponents.hasOwnProperty(key)) {
         urlElements.push(key + '=' + encodeURIComponent(urlComponents[key]))
      }
   }
   const url = baseUrl + urlElements.join('&');

   return url
}

export function buildOmdbApiUrlFromComponents(urlComponents) {
   const omdbApiBaseUrl = 'http://www.omdbapi.com/?'
   const apiKey = '1e9e9365'
   urlComponents.apiKey = apiKey // Add key to list of passed components

   return buildUrlFromComponents(omdbApiBaseUrl, urlComponents)
}

export function buildTmdbApiUrlFromComponents(urlComponents, search = false) {
   const tmdbApiSearchBaseUrl = "https://api.themoviedb.org/3/search/tv?"
   const tmdbApiBaseUrl = "https://api.themoviedb.org/3/tv?"
   urlComponents.api_key = apiKey // Add key to list of passed components

   let url = search ? tmdbApiSearchBaseUrl : tmdbApiBaseUrl;
   return buildUrlFromComponents(url, urlComponents)
}

export function buildTmdbApiUrlForShowInformation(showId, seasonId=0, episodeId=0, credits=false) {
   const tmdbApiBaseUrl = "https://api.themoviedb.org/3/tv/"
   // URL: https://api.themoviedb.org/3/tv/253?api_key=1c40e7b79848bde76ff5b90fe48cff04          info about a specific show
   // URL: https://api.themoviedb.org/3/tv/253/season/1?api_key=1c40e7b79848bde76ff5b90fe48cff04 info about a specific show and season #
   // URL: https://api.themoviedb.org/3/tv/253/credits?api_key=1c40e7b79848bde76ff5b90fe48cff04   info about a specific show credits
   let url = tmdbApiBaseUrl+showId
   if( seasonId ) {
      url = url + "/season/" + seasonId
      if( episodeId ) {
         url = url + "/episode/" + episodeId
      }
   } else if( credits ) {
      url = url + credits
   }
   // tack on the api_key
   url = url + "?api_key=" + apiKey
   url = url + "&append_to_response=images,credits"
   
   return url
}

export function buildTmdbApiUrlForPersonInformation(personId) {
   const tmdbApiBaseUrl = "https://api.themoviedb.org/3/person/"
   // URL: https://api.themoviedb.org/3/person/1001657?api_key=1c40e7b79848bde76ff5b90fe48cff04   info about a specific person
   let url = tmdbApiBaseUrl+personId
   
   // tack on the api_key and append response for extra info
   url = url + "?api_key=" + apiKey
   url = url + "&append_to_response=images,tv_credits"
   
   return url
}

export function buildTmdbUrlForImagePathAndSize(imagePath, size = "w300") {
   if (!imagePath || imagePath === undefined || imagePath === "") {
      return "/no-poster-small.png"
   }
   if (!imagePath.startsWith("/")) {  // Assumes that imagePath already has a leading "/. Otherwise, add it
      imagePath = "/" + imagePath
   }
   // See https://developers.themoviedb.org/3/configuration/get-api-configuration 
   // Images sizes can be obtained dynamically by calling: https://api.themoviedb.org/3/configuration?api_key=1c40e7b79848bde76ff5b90fe48cff04
   // we will assume that they don't change that often and so here's a list of sizes as of today
   const imagesKnownSizes = ["w45", "w92", "w154", "w185", "w300", "w342", "w500", "h632", "w780", "w1280", "original"]
   const tmdbImagesBaseUrl = "https://image.tmdb.org/t/p/"
   if (!imagesKnownSizes.includes(size)) {
      size = "w300"
   }
   // Example: https://image.tmdb.org/t/p/w780/kZv92eTc0Gg3mKxqjjDAM73z9cy.jpg
   return tmdbImagesBaseUrl + size + imagePath
}
// Use missing image when image can'f be loaded
export function handleImageError(ev) {
   ev.target.src = '/no-poster.png'
}
