// Action Types
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';

// Action Types for Registration
const REGISTER_REQUEST = 'REGISTER_REQUEST';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAILURE = 'REGISTER_FAILURE';

// Initial State
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

// Reducer
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default authReducer;

// Action Creators
export const loginRequest = () => ({
  type: LOGIN_REQUEST
});

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error
});

export const logout = () => ({
  type: LOGOUT
});

export const registerRequest = () => ({
  type: REGISTER_REQUEST
});

export const registerSuccess = (user) => ({
  type: REGISTER_SUCCESS,
  payload: user
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error
});

// Async Actions
export const login = (credentials) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      // API call would go here
      // Replace with actual API call:
      // const response = await axios.post('/api/auth/login', credentials);
      // dispatch(loginSuccess(response.data));
      console.log('Simulating login API call with credentials:', credentials);
      const response = { data: { id: 1, name: 'Logged In User', email: credentials.email } }; // Simulate response
      dispatch(loginSuccess(response.data));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };
};

export const register = (userData) => {
  return async (dispatch) => {
    dispatch(registerRequest());
    try {
      // API call would go here
      // Replace with actual API call:
      // const response = await axios.post('/api/auth/register', userData);
      // dispatch(registerSuccess(response.data));
      console.log('Simulating register API call with userData:', userData);
      const response = { data: { id: Date.now(), name: userData.name, email: userData.email } }; // Simulate response
      dispatch(registerSuccess(response.data));
    } catch (error) {
      dispatch(registerFailure(error.message));
    }
  };
};
