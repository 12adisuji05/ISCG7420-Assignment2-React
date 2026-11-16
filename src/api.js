// Address of the Django REST Framework API
// On Render this comes from the REACT_APP_API_URL environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

// Turns an error from the API into one message we can show on the page
export function getError(error) {
    if (!error.response) {
        return 'Cannot reach the server. Please try again in a minute.';
    }
    return Object.values(error.response.data).join(' ');
}

export default API_URL;
