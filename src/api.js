import axios from 'axios';

export const sendGraphRun = graphData => {
  axios.post( process.env.REACT_APP_API_SERVER+'/addGraph', graphData)
    .then(res => console.log('bk: api.js: sendGraphRun: then: res: ', res))
    .catch(err => console.error('error uploading graph run: ', err.data, err.message))
}