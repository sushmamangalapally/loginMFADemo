import { assignments, users } from './mockData.js';

/**
 * @description Mock as fetching API for miliseconds using setTimeout
 *
 * @returns {string} Miliseconds
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve({event: 'Sleep Success'}), ms));

/**
 * Fetches data from '/assignments' API endpoint.
 * @param {string} url - The URL of the API endpoint to fetch data from.
 * @returns {Promise<Object>} A Promise that resolves with the parsed JSON data from the API.
 * @returns {Reject} If no data is found
 */
async function fetchMock(url) {
	await sleep(400);
  let data = null;
  if (url.includes('/assignments')) {
    data = assignments;
  }
  else if (url.includes('/users')) {
    data = users;
  }
  if (data) {
    return {
      ok: true,
      status: 200,
      json: () => Promise.resolve(data),
    };
  } else {
    throw(new Error({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }));
  }
}

export default fetchMock;
