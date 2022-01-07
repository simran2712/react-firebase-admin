import { createReducer } from 'redux-act';

import {
  scribeS_FETCH_DATA_INIT,
  scribeS_FETCH_DATA_SUCCESS,
  scribeS_FETCH_DATA_FAIL,
  scribeS_DELETE_scribe_INIT,
  scribeS_DELETE_scribe_SUCCESS,
  scribeS_DELETE_scribe_FAIL,
  scribeS_CREATE_scribe_INIT,
  scribeS_CREATE_scribe_SUCCESS,
  scribeS_CREATE_scribe_FAIL,
  scribeS_MODIFY_scribe_INIT,
  scribeS_MODIFY_scribe_SUCCESS,
  scribeS_MODIFY_scribe_FAIL,
  scribeS_CLEAN_UP,
  scribeS_CLEAR_DATA_LOGOUT,
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
    [scribeS_FETCH_DATA_INIT]: () => ({
      ...initialState,
      loading: true,
    }),
    [scribeS_FETCH_DATA_SUCCESS]: (state, payload) => ({
      ...state,
      data: payload.data,
      loading: false,
      error: null,
    }),
    [scribeS_FETCH_DATA_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [scribeS_DELETE_scribe_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [scribeS_DELETE_scribe_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.filter((elem) => elem.id !== payload.id),
      loading: false,
      error: null,
      deleted: true,
    }),
    [scribeS_DELETE_scribe_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [scribeS_CREATE_scribe_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [scribeS_CREATE_scribe_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.concat(payload.scribe),
      loading: false,
      error: null,
      success: true,
    }),
    [scribeS_CREATE_scribe_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [scribeS_MODIFY_scribe_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [scribeS_MODIFY_scribe_SUCCESS]: (state, payload) => ({
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
    [scribeS_MODIFY_scribe_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [scribeS_CLEAN_UP]: (state) => ({
      ...state,
      loading: false,
      error: null,
      success: false,
      deleted: false,
    }),
    [scribeS_CLEAR_DATA_LOGOUT]: () => ({
      ...initialState,
    }),
  },
  initialState
);
