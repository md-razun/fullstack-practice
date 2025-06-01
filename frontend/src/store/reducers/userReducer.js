// Action Types
const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
const FETCH_USER_PROFILE_REQUEST = 'FETCH_USER_PROFILE_REQUEST';
const FETCH_USER_PROFILE_SUCCESS = 'FETCH_USER_PROFILE_SUCCESS';
const FETCH_USER_PROFILE_FAILURE = 'FETCH_USER_PROFILE_FAILURE';

// Initial State
const initialState = {
  users: [],
  userProfile: null,
  loading: false,
  error: null
};

// Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
    case FETCH_USER_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    case FETCH_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: action.payload,
        loading: false
      };
    case FETCH_USERS_FAILURE:
    case FETCH_USER_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;

// Action Creators
export const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST
});

export const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users
});

export const fetchUsersFailure = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: error
});

export const fetchUserProfileRequest = () => ({
  type: FETCH_USER_PROFILE_REQUEST
});

export const fetchUserProfileSuccess = (profile) => ({
  type: FETCH_USER_PROFILE_SUCCESS,
  payload: profile
});

export const fetchUserProfileFailure = (error) => ({
  type: FETCH_USER_PROFILE_FAILURE,
  payload: error
});

// Async Actions
export const fetchUsers = () => {
  return async (dispatch) => {
    dispatch(fetchUsersRequest());
    try {
      // API call would go here
      const response = { 
        data: [
          { id: 1, name: 'User 1', email: 'user1@example.com' },
          { id: 2, name: 'User 2', email: 'user2@example.com' },
          { id: 3, name: 'User 3', email: 'user3@example.com' }
        ] 
      };
      dispatch(fetchUsersSuccess(response.data));
    } catch (error) {
      dispatch(fetchUsersFailure(error.message));
    }
  };
};

export const fetchUserProfile = (userId) => {
  return async (dispatch) => {
    dispatch(fetchUserProfileRequest());
    try {
      // API call would go here
      const response = { 
        data: { 
          id: userId, 
          name: `User ${userId}`, 
          email: `user${userId}@example.com`,
          bio: 'Lorem ipsum dolor sit amet',
          joinDate: '2023-01-01'
        } 
      };
      dispatch(fetchUserProfileSuccess(response.data));
    } catch (error) {
      dispatch(fetchUserProfileFailure(error.message));
    }
  };
};
