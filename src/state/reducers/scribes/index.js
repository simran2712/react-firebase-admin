import { createReducer } from 'redux-act';

import {
  SCRIBES_FETCH_DATA_INIT,
  SCRIBES_FETCH_DATA_SUCCESS,
  SCRIBES_FETCH_DATA_FAIL,
  SCRIBES_DELETE_USER_INIT,
  SCRIBES_DELETE_USER_SUCCESS,
  SCRIBES_DELETE_USER_FAIL,
  SCRIBES_CREATE_USER_INIT,
  SCRIBES_CREATE_USER_SUCCESS,
  SCRIBES_CREATE_USER_FAIL,
  SCRIBES_MODIFY_USER_INIT,
  SCRIBES_MODIFY_USER_SUCCESS,
  SCRIBES_MODIFY_USER_FAIL,
  SCRIBES_CLEAN_UP,
  SCRIBES_CLEAR_DATA_LOGOUT,
} from 'state/actions/scribes';

const initialState = {
  data: [],
  loading: false,
  error: null,
  success: false,
  deleted: false,
};

export const scribesReducer = createReducer(
  {
    [SCRIBES_FETCH_DATA_INIT]: () => ({
      ...initialState,
      loading: true,
    }),
    [SCRIBES_FETCH_DATA_SUCCESS]: (state, payload) => ({
      ...state,
      data: payload.data,
      loading: false,
      error: null,
    }),
    [SCRIBES_FETCH_DATA_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [SCRIBES_DELETE_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [SCRIBES_DELETE_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.filter((elem) => elem.id !== payload.id),
      loading: false,
      error: null,
      deleted: true,
    }),
    [SCRIBES_DELETE_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [SCRIBES_CREATE_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [SCRIBES_CREATE_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.concat(payload.scribe),
      loading: false,
      error: null,
      success: true,
    }),
    [SCRIBES_CREATE_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [SCRIBES_MODIFY_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [SCRIBES_MODIFY_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: !state.data
        ? []
        : state.data.map((elem) => {
            if (elem.id === payload.id) {
              return {
                name: payload.scribe.name,
                location: payload.scribe.location,
                id: payload.id,
                logoUrl: payload.scribe.logoUrl,
                createdAt: payload.scribe.createdAt,
                email: elem.email,
              };
            }
            return elem;
          }),
      loading: false,
      error: null,
      success: true,
    }),
    [SCRIBES_MODIFY_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [SCRIBES_CLEAN_UP]: (state) => ({
      ...state,
      loading: false,
      error: null,
      success: false,
      deleted: false,
    }),
    [SCRIBES_CLEAR_DATA_LOGOUT]: () => ({
      ...initialState,
    }),
  },
  initialState
);
