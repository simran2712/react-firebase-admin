import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { reducer as toastrReducer } from 'react-redux-toastr';

import { authReducer } from './auth';
import { usersReducer } from './users';
import { scribesReducer } from './scribes';
import { preferencesReducer } from './preferences';
import { requestsReducer } from './requests';

export default combineReducers({
  auth: persistReducer(
    {
      key: 'auth',
      storage,
      blacklist: ['error', 'loading'],
    },
    authReducer
  ),
  preferences: persistReducer(
    { key: 'preferences', storage },
    preferencesReducer
  ),
  users: persistReducer(
    {
      key: 'users',
      storage,
      blacklist: ['error', 'loading'],
    },
    usersReducer
  ),
  Scribes: persistReducer(
    {
      key: 'Scribes',
      storage,
      blacklist: ['error', 'loading']
    },
    scribesReducer
  ),
  Requests: persistReducer(
    {
      key: 'Requests',
      storage,
      blacklist: ['error', 'loading']
    },
    requestsReducer
  ),
  toastr: toastrReducer,
});
