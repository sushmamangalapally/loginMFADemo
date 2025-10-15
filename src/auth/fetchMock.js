import { assignments } from './mockData.js';

function fetchMock(url) {
  return new Promise((resolve, reject) => {
    // Simulate network delay of 400ms
    setTimeout(() => {
      let data = null;
      if (url.includes('/assignments')) {
        data = assignments;
      }

      if (data) {
        // Resolve the promise with a Assignment Mock Response object
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
