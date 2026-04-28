import API from '../api/api';

export const sendOtp = (email) => {
  return API.post('/auth/send-otp', null, {
    params: { email },
  });
};

export const verifyOtp = (email, otp) => {
  return API.post('/auth/verify-otp', null, {
    params: { email, otp },
  });
};

export const registerUser = (email, password) => {
  return API.post('/auth/register', null, {
    params: { email, password },
  });
};

export const loginUser = async (email, password) => {
  return await API.post('/auth/login', null, {
    params: { email, password },
  });
};