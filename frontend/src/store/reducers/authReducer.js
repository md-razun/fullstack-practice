// Action Types
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';

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
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case LOGIN_FAILURE:
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

// Async Actions
export const login = (credentials) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      // API call would go here
      const response = { data: { id: 1, name: 'User', email: 'user@example.com' } };
      dispatch(loginSuccess(response.data));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };
};
