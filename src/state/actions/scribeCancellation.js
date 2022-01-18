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

export const CANCELLATIONS_FETCH_DATA_INIT = createAction('CANCELLATIONS_FETCH_DATA_INIT');
export const CANCELLATIONS_FETCH_DATA_SUCCESS = createAction(
  'CANCELLATIONS_FETCH_DATA_SUCCESS'
);
export const CANCELLATIONS_FETCH_DATA_FAIL = createAction('CANCELLATIONS_FETCH_DATA_FAIL');

export const CANCELLATIONS_DELETE_USER_INIT = createAction('CANCELLATIONS_DELETE_USER_INIT');
export const CANCELLATIONS_DELETE_USER_SUCCESS = createAction(
  'CANCELLATIONS_DELETE_USER_SUCCESS'
);
export const CANCELLATIONS_DELETE_USER_FAIL = createAction('CANCELLATIONS_DELETE_USER_FAIL');

export const CANCELLATIONS_CREATE_USER_INIT = createAction('CANCELLATIONS_CREATE_USER_INIT');
export const CANCELLATIONS_CREATE_USER_SUCCESS = createAction(
  'CANCELLATIONS_CREATE_USER_SUCCESS'
);
export const CANCELLATIONS_CREATE_USER_FAIL = createAction('CANCELLATIONS_CREATE_USER_FAIL');

export const CANCELLATIONS_MODIFY_USER_INIT = createAction('CANCELLATIONS_MODIFY_USER_INIT');
export const CANCELLATIONS_MODIFY_USER_SUCCESS = createAction(
  'CANCELLATIONS_MODIFY_USER_SUCCESS'
);
export const CANCELLATIONS_MODIFY_USER_FAIL = createAction('CANCELLATIONS_MODIFY_USER_FAIL');

export const CANCELLATIONS_CLEAN_UP = createAction('CANCELLATIONS_CLEAN_UP');

export const CANCELLATIONS_CLEAR_DATA_LOGOUT = createAction('CANCELLATIONS_CLEAR_DATA_LOGOUT');

export const fetchCancellations = (cancellationId = '') => {
  return async (dispatch, getState) => {
    dispatch(checkUserData());

    dispatch(CANCELLATIONS_FETCH_DATA_INIT());

    if (cancellationId) {
      let cancellation;
      try {

        cancellation = await fetchDocument('cancellations', cancellationId);
        
      } catch (error) {
        /* eslint-disable no-console */
        console.log("error fetching cancellation doc, ", error);
        /* eslint-enable no-console */
        toastr.error('cant fetch cancellation doc', error);
        return dispatch(CANCELLATIONS_FETCH_DATA_FAIL({ error }));
      }
      
      if (!cancellation) {
        const errorMessage = 'User not available';
        toastr.error('Cant get the current cancellation', errorMessage);
        return dispatch(CANCELLATIONS_FETCH_DATA_FAIL({ error: errorMessage }));
      }
      
      const cancellations= getState().cancellations.data;
      cancellations.push(cancellation);
      
      return dispatch(
        CANCELLATIONS_FETCH_DATA_SUCCESS({
          data: cancellations,
        })
        );
    }
    

    let cancellations;

    try {
        cancellations = await fetchCollection('cancellations');
    } catch (error) {
      /* eslint-disable no-console */
      console.log("error fetching cancellation collec, ", error);
      /* eslint-enable no-console */
      toastr.error('Cant get the cancellations collection', error);
      return dispatch(CANCELLATIONS_FETCH_DATA_FAIL({ error }));
    }

    return dispatch(
      CANCELLATIONS_FETCH_DATA_SUCCESS({
        data: cancellations,
      })
    );
  };
};

const deleteLogo = (oldLogo) => {
  if (!oldLogo.includes('firebasestorage')) {
    return null;
  }
  const logoPath = oldLogo.split('cancellations%2F').pop().split('?alt=media').shift();
  return firebase.storage().ref(`cancellations/${logoPath}`).delete();
};

export const deletecancellation = (id) => {
  return async (dispatch, getState) => {
    dispatch(CANCELLATIONS_DELETE_USER_INIT());
    const { locale } = getState().preferences;
    const { logoUrl } = getState()
      .cancellations.data.filter((cancellation) => cancellation.id === id)
      .pop();

    const deleteLogoTask = logoUrl ? deleteLogo(logoUrl) : null;

    const deleteUserTask = deleteDocument('cancellations', id);

    try {
      await Promise.all([deleteLogoTask, deleteUserTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        CANCELLATIONS_DELETE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'The cancellation was deleted.');
    return dispatch(CANCELLATIONS_DELETE_USER_SUCCESS({ id }));
  };
};

export const clearUsersDataLogout = () => {
  return (dispatch) => {
    dispatch(CANCELLATIONS_CLEAR_DATA_LOGOUT());
  };
};

const uploadLogo = (uid, file) => {
  const storageRef = firebase.storage().ref();

  const fileExtension = file.name.split('.').pop();

  const fileName = `${uid}.${fileExtension}`;

  return storageRef.child(`cancellations/${fileName}`).put(file);
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
    dispatch(CANCELLATIONS_CREATE_USER_INIT());
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
        CANCELLATIONS_CREATE_USER_FAIL({
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
        CANCELLATIONS_CREATE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'User created successfully');
    return dispatch(CANCELLATIONS_CREATE_USER_SUCCESS({ user: response.data }));
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
    dispatch(CANCELLATIONS_MODIFY_USER_INIT());
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
        CANCELLATIONS_MODIFY_USER_FAIL({
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

    return dispatch(CANCELLATIONS_MODIFY_USER_SUCCESS({ user: userData, id }));
  };
};

export const CancellationsCleanUp = () => (dispatch) => dispatch(CANCELLATIONS_CLEAN_UP());
