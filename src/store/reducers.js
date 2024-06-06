
const initialState = {
  user: {
    id: null,
    token: null,
    role: null
  },
  lengthNoification: 0 
};

  
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: {
          id: action.payload.id,
          token: action.payload.token,
          role: action.payload.role
        }
      };
    case 'UPDATE_NOTIFICATION_LENGTH':
      return {
        ...state,
        lengthNoification: action.payload
      };
    default:
      return state;
  }
};

export default rootReducer;

  