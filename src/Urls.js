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