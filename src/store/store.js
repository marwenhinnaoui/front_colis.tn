import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';
import { encryptTransform } from 'redux-persist-transform-encrypt'; 

const encryptor = encryptTransform({
  secretKey: 'your-secret-key', 
  onError: function(error) {

  }
});

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware()); 
export const persistor = persistStore(store);
