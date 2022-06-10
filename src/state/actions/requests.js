import { createAction } from 'redux-act';
import { toastr } from 'react-redux-toastr';

import { firebaseError } from 'utils';
import firebase from 'firebase.js';
import { checkUserData, AUTH_UPDATE_USER_DATA } from './auth';
import {
  fetchCollection,
  fetchDocument,
  createDocument,
  deleteDocument,
  updateDocument,
} from '../api';

export const REQUESTS_FETCH_DATA_INIT = createAction('REQUESTS_FETCH_DATA_INIT');
export const REQUESTS_FETCH_DATA_SUCCESS = createAction(
  'REQUESTS_FETCH_DATA_SUCCESS'
);
export const REQUESTS_FETCH_DATA_FAIL = createAction('REQUESTS_FETCH_DATA_FAIL');

export const REQUESTS_DELETE_USER_INIT = createAction('REQUESTS_DELETE_USER_INIT');
export const REQUESTS_DELETE_USER_SUCCESS = createAction(
  'REQUESTS_DELETE_USER_SUCCESS'
);
export const REQUESTS_DELETE_USER_FAIL = createAction('REQUESTS_DELETE_USER_FAIL');

export const REQUESTS_CREATE_USER_INIT = createAction('REQUESTS_CREATE_USER_INIT');
export const REQUESTS_CREATE_USER_SUCCESS = createAction(
  'REQUESTS_CREATE_USER_SUCCESS'
);
export const REQUESTS_CREATE_USER_FAIL = createAction('REQUESTS_CREATE_USER_FAIL');

export const REQUESTS_MODIFY_USER_INIT = createAction('REQUESTS_MODIFY_USER_INIT');
export const REQUESTS_MODIFY_USER_SUCCESS = createAction(
  'REQUESTS_MODIFY_USER_SUCCESS'
);
export const REQUESTS_MODIFY_USER_FAIL = createAction('REQUESTS_MODIFY_USER_FAIL');

export const REQUESTS_CLEAN_UP = createAction('REQUESTS_CLEAN_UP');

export const REQUESTS_CLEAR_DATA_LOGOUT = createAction('REQUESTS_CLEAR_DATA_LOGOUT');

export const fetchRequests = (requestId = '') => {
  return async (dispatch, getState) => {
    dispatch(checkUserData());

    dispatch(REQUESTS_FETCH_DATA_INIT());

    if (requestId) {
      let request;
      try {

        request = await fetchDocument('requests', requestId);
        
      } catch (error) {
        /* eslint-disable no-console */
        console.log("error fetching request doc, ", error);
        /* eslint-enable no-console */
        toastr.error('cant fetch request doc', error);
        return dispatch(REQUESTS_FETCH_DATA_FAIL({ error }));
      }
      
      if (!request) {
        const errorMessage = 'User not available';
        toastr.error('Cant get the current request', errorMessage);
        return dispatch(REQUESTS_FETCH_DATA_FAIL({ error: errorMessage }));
      }
      
      const requests = getState().requests.data;
      requests.push(request);
      
      return dispatch(
        REQUESTS_FETCH_DATA_SUCCESS({
          data: requests,
        }));
    }
    

    let requests;

    try {
        requests = await fetchCollection('requests', { sort: {attribute: 'dateSlot', order: 'desc'}});
    } catch (error) {
      /* eslint-disable no-console */
      console.log("error fetching request collec, ", error);
      /* eslint-enable no-console */
      toastr.error('Cant get the requests collection', error);
      return dispatch(REQUESTS_FETCH_DATA_FAIL({ error }));
    }

    return dispatch(
      REQUESTS_FETCH_DATA_SUCCESS({
        data: requests,
      })
    );
  };
};

const deleteLogo = (oldLogo) => {
  if (!oldLogo.includes('firebasestorage')) {
    return null;
  }
  const logoPath = oldLogo.split('requests%2F').pop().split('?alt=media').shift();
  return firebase.storage().ref(`requests/${logoPath}`).delete();
};

export const deleteRequest = (id) => {
  return async (dispatch, getState) => {
    dispatch(REQUESTS_DELETE_USER_INIT());
    const { locale } = getState().preferences;
    const { logoUrl } = getState()
      .requests.data.filter((request) => request.id === id)
      .pop();

    const deleteLogoTask = logoUrl ? deleteLogo(logoUrl) : null;

    const deleteUserTask = deleteDocument('requests', id);

    try {
      await Promise.all([deleteLogoTask, deleteUserTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        REQUESTS_DELETE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'The request was deleted.');
    return dispatch(REQUESTS_DELETE_USER_SUCCESS({ id }));
  };
};

export const clearUsersDataLogout = () => {
  return (dispatch) => {
    dispatch(REQUESTS_CLEAR_DATA_LOGOUT());
  };
};

const uploadLogo = (uid, file) => {
  const storageRef = firebase.storage().ref();

  const fileExtension = file.name.split('.').pop();

  const fileName = `${uid}.${fileExtension}`;

  return storageRef.child(`requests/${fileName}`).put(file);
};

const getLogoUrl = (uid, file) => {
  const fileExtension = file.name.split('.').pop();

  const bucketUrl = `${process.env.REACT_APP_FIRE_BASE_STORAGE_API}`;

  return `${bucketUrl}/o/users%2F${uid}_200x200.${fileExtension}?alt=media`;
};

export const createUser = ({
  name,
  email,
  location,
  file,
  createdAt,
  isAdmin,
}) => {
  return async (dispatch, getState) => {
    dispatch(REQUESTS_CREATE_USER_INIT());
    const { locale } = getState().preferences;

    let response;
    try {
      const createUserAuth = firebase
        .functions()
        .httpsCallable('httpsCreateUser');

      response = await createUserAuth({ email, isAdmin });
    } catch (error) {
      const errorMessage = firebaseError(error.message, locale);
      toastr.error('', errorMessage);
      return dispatch(
        REQUESTS_CREATE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    const { uid } = response.data;

    let uploadLogoTask = null;
    let logoUrl = null;
    if (file) {
      logoUrl = getLogoUrl(uid, file);
      uploadLogoTask = uploadLogo(uid, file);
    }
    const userData = { name, email, location, logoUrl, createdAt, isAdmin };

    const createUserDbTask = createDocument('users', uid, userData);

    const actionCodeSettings = {
      url: process.env.REACT_APP_LOGIN_PAGE_URL,
      handleCodeInApp: true,
    };

    const sendSignInLinkToEmailTask = firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings);

    try {
      await Promise.all([
        uploadLogoTask,
        createUserDbTask,
        sendSignInLinkToEmailTask,
      ]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        REQUESTS_CREATE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'User created successfully');
    return dispatch(REQUESTS_CREATE_USER_SUCCESS({ user: response.data }));
  };
};

export const modifyUser = ({
  name,
  location,
  isAdmin,
  file,
  createdAt,
  id,
  isEditing,
  isProfile,
}) => {
  return async (dispatch, getState) => {
    dispatch(REQUESTS_MODIFY_USER_INIT());
    const { locale } = getState().preferences;
    const user = isProfile
      ? getState().auth.userData
      : getState().users.data.find((thisUser) => thisUser.id === id);
    const { logoUrl } = user;
    let deleteLogoTask;
    let uploadLogoTask;
    let newLogoUrl = null;
    if (file) {
      newLogoUrl = getLogoUrl(id, file);
      deleteLogoTask = logoUrl && deleteLogo(logoUrl);
      uploadLogoTask = uploadLogo(id, file);
    }

    const userData = {
      name,
      location,
      createdAt,
      isAdmin: isAdmin || user.isAdmin,
      logoUrl: logoUrl || newLogoUrl,
    };
    const updateUserDbTask = updateDocument('users', id, userData);

    try {
      await Promise.all([deleteLogoTask, uploadLogoTask, updateUserDbTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        REQUESTS_MODIFY_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    const { uid } = firebase.auth().currentUser;

    if (id === uid) {
      dispatch(AUTH_UPDATE_USER_DATA({ ...userData, id }));
    }

    if (isProfile) {
      toastr.success('', 'Profile updated successfully');
    } else if (isEditing) {
      toastr.success('', 'User updated successfully');
    }

    return dispatch(REQUESTS_MODIFY_USER_SUCCESS({ user: userData, id }));
  };
};

export const RequestsCleanUp = () => (dispatch) => dispatch(REQUESTS_CLEAN_UP());