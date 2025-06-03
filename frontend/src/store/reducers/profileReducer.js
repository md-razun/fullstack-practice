// Initial state for profile
const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {}
};

// Profile reducer
const profileReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // Add cases for profile actions here
    default:
      return state;
  }
};

export default profileReducer;
