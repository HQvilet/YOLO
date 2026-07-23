import axios from "axios"

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.defaults.withCredentials = true

api.interceptors.response.use((response) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

  const handleDates = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && isoDateRegex.test(obj[key])) {
        obj[key] = new Date(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        handleDates(obj[key]);
      }
    }
  };

  handleDates(response.data);
  return response;
});

export default api;