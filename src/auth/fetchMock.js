import { assignments, users } from './mockData.js';
/**
 * Fetches data from '/assignments' API endpoint.
 * @param {string} url - The URL of the API endpoint to fetch data from.
 * @returns {Promise<Object>} A Promise that resolves with the parsed JSON data from the API.
 * @returns {Reject} If no data is found
 */
function fetchMock(url) {
  return new Promise((resolve, reject) => {
    // Simulate network delay of 400ms
    setTimeout(() => {
      let data = null;
      if (url.includes('/assignments')) {
        data = assignments;
      }
      else if (url.includes('/users')) {
        data = users;
      }

      if (data) {
        // Resolve the promise with  Mock Response object
        resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(data),
        });
      } else {
        // Reject the promise if no data is found
        reject({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });
      }
    }, 400);
  });
}

export default fetchMock;
