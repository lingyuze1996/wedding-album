import axios from 'axios';

const PHOTO_REFERENCE_API = 'https://9bjj2y0jnj.execute-api.ap-east-1.amazonaws.com/Prod';

export const getPhotosByRange = async (start, end) => {
  const url = `${PHOTO_REFERENCE_API}/dbphotos?start=${start}&end=${end}`;
  const response = await axios.get(url);
  return response.data;
};

export const getPhotoRef = async (key, type = 'thumbnail') => {
  const url = `${PHOTO_REFERENCE_API}/photos?type=${type}&key=${key}`;
  const response = await axios.get(url);
  return response.data.url;
};
