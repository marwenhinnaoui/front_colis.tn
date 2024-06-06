export const setUser = (id, token , role) => ({
    type: 'SET_USER',
    payload: { id, token, role }
  });


  export const updateNotificationLength = (lengthNoification) => {
    return {
      type: 'UPDATE_NOTIFICATION_LENGTH',
      payload: lengthNoification,
    };
  };