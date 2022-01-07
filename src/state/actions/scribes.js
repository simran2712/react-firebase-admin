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

export const SCRIBES_FETCH_DATA_INIT = createAction('SCRIBES_FETCH_DATA_INIT');
export const SCRIBES_FETCH_DATA_SUCCESS = createAction(
  'SCRIBES_FETCH_DATA_SUCCESS'
);
export const SCRIBES_FETCH_DATA_FAIL = createAction('SCRIBES_FETCH_DATA_FAIL');

export const SCRIBES_DELETE_USER_INIT = createAction('SCRIBES_DELETE_USER_INIT');
export const SCRIBES_DELETE_USER_SUCCESS = createAction(
  'SCRIBES_DELETE_USER_SUCCESS'
);
export const SCRIBES_DELETE_USER_FAIL = createAction('SCRIBES_DELETE_USER_FAIL');

export const SCRIBES_CREATE_USER_INIT = createAction('SCRIBES_CREATE_USER_INIT');
export const SCRIBES_CREATE_USER_SUCCESS = createAction(
  'SCRIBES_CREATE_USER_SUCCESS'
);
export const SCRIBES_CREATE_USER_FAIL = createAction('SCRIBES_CREATE_USER_FAIL');

export const SCRIBES_MODIFY_USER_INIT = createAction('SCRIBES_MODIFY_USER_INIT');
export const SCRIBES_MODIFY_USER_SUCCESS = createAction(
  'SCRIBES_MODIFY_USER_SUCCESS'
);
export const SCRIBES_MODIFY_USER_FAIL = createAction('SCRIBES_MODIFY_USER_FAIL');

export const SCRIBES_CLEAN_UP = createAction('SCRIBES_CLEAN_UP');

export const SCRIBES_CLEAR_DATA_LOGOUT = createAction('SCRIBES_CLEAR_DATA_LOGOUT');

export const fetchUsers = (userId = '') => {
  return async (dispatch, getState) => {
    dispatch(checkUserData());

    dispatch(SCRIBES_FETCH_DATA_INIT());

    if (scribeId) {
      let scribe;
      try {

        scribe = await fetchDocument('scribes', scribeId);
        
      } catch (error) {
        /* eslint-disable no-console */
        console.log("error fetching scribe doc, ", error);
        /* eslint-enable no-console */
        toastr.error('cant fetch scribe doc', error);
        return dispatch(SCRIBES_FETCH_DATA_FAIL({ error }));
      }
      
      if (!scribe) {
        const errorMessage = 'User not available';
        toastr.error('Cant get the current scribe', errorMessage);
        return dispatch(SCRIBES_FETCH_DATA_FAIL({ error: errorMessage }));
      }
      
      const scribes = getState().scribes.data;
      scribes.push(scribe);
      
      return dispatch(
        SCRIBES_FETCH_DATA_SUCCESS({
          data: scribes,
        })
        );
    }
    const { id } = getState().auth.scribeData;

    let scribes;

    try {
      scribes = await fetchCollection('scribes');
    } catch (error) {
      /* eslint-disable no-console */
      console.log("error fetching scribe collec, ", error);
      /* eslint-enable no-console */
      toastr.error('Cant get the scribes collection', error);
      return dispatch(SCRIBES_FETCH_DATA_FAIL({ error }));
    }

    return dispatch(
      SCRIBES_FETCH_DATA_SUCCESS({
        data: scribes.filter((scribe) => scribe.id !== id),
      })
    );
  };
};

const deleteLogo = (oldLogo) => {
  if (!oldLogo.includes('firebasestorage')) {
    return null;
  }
  const logoPath = oldLogo.split('scribes%2F').pop().split('?alt=media').shift();
  return firebase.storage().ref(`scribes/${logoPath}`).delete();
};

export const deleteUser = (id) => {
  return async (dispatch, getState) => {
    dispatch(SCRIBES_DELETE_USER_INIT());
    const { locale } = getState().preferences;
    const { logoUrl } = getState()
      .scribes.data.filter((scribe) => scribe.id === id)
      .pop();

    const deleteLogoTask = logoUrl ? deleteLogo(logoUrl) : null;

    const deleteUserTask = deleteDocument('scribes', id);

    try {
      await Promise.all([deleteLogoTask, deleteUserTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        SCRIBES_DELETE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'The scribe was deleted.');
    return dispatch(SCRIBES_DELETE_USER_SUCCESS({ id }));
  };
};

export const clearUsersDataLogout = () => {
  return (dispatch) => {
    dispatch(SCRIBES_CLEAR_DATA_LOGOUT());
  };
};

const uploadLogo = (uid, file) => {
  const storageRef = firebase.storage().ref();

  const fileExtension = file.name.split('.').pop();

  const fileName = `${uid}.${fileExtension}`;

  return storageRef.child(`scribes/${fileName}`).put(file);
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
    dispatch(SCRIBES_CREATE_USER_INIT());
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
        SCRIBES_CREATE_USER_FAIL({
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
        SCRIBES_CREATE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'User created successfully');
    return dispatch(SCRIBES_CREATE_USER_SUCCESS({ user: response.data }));
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
    dispatch(SCRIBES_MODIFY_USER_INIT());
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
        SCRIBES_MODIFY_USER_FAIL({
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

    return dispatch(SCRIBES_MODIFY_USER_SUCCESS({ user: userData, id }));
  };
};

export const usersCleanUp = () => (dispatch) => dispatch(SCRIBES_CLEAN_UP());
