import fetch from "node-fetch";

class SearchController {
  static searchLocation(req, res) {
    const key = process.env.API_KEY;
    const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';
    const apiKey = `&appid=${key}&units=imperial`;
    const location = req.query.location;
    const userLocation = (baseUrl, location, apiKey) => {
      let url = baseUrl + location + apiKey;
      return url;
    };

    const apiUrl = userLocation(baseUrl, location, apiKey);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        res.send({ data });
      })
      .catch(error => {
        res.send({ error });
      });
  }
}

export default SearchController;
