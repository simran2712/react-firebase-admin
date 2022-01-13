import { createReducer } from 'redux-act';

import {
  REQUESTS_FETCH_DATA_INIT,
  REQUESTS_FETCH_DATA_SUCCESS,
  REQUESTS_FETCH_DATA_FAIL,
  REQUESTS_DELETE_USER_INIT,
  REQUESTS_DELETE_USER_SUCCESS,
  REQUESTS_DELETE_USER_FAIL,
  REQUESTS_CREATE_USER_INIT,
  REQUESTS_CREATE_USER_SUCCESS,
  REQUESTS_CREATE_USER_FAIL,
  REQUESTS_MODIFY_USER_INIT,
  REQUESTS_MODIFY_USER_SUCCESS,
  REQUESTS_MODIFY_USER_FAIL,
  REQUESTS_CLEAN_UP,
  REQUESTS_CLEAR_DATA_LOGOUT,
} from 'state/actions/requests';

const initialState = {
  data: [],
  loading: false,
  error: null,
  success: false,
  deleted: false,
};

export const requestsReducer = createReducer(
  {
    [REQUESTS_FETCH_DATA_INIT]: () => ({
      ...initialState,
      loading: true,
    }),
    [REQUESTS_FETCH_DATA_SUCCESS]: (state, payload) => ({
      ...state,
      data: payload.data,
      loading: false,
      error: null,
    }),
    [REQUESTS_FETCH_DATA_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [REQUESTS_DELETE_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [REQUESTS_DELETE_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.filter((elem) => elem.id !== payload.id),
      loading: false,
      error: null,
      deleted: true,
    }),
    [REQUESTS_DELETE_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [REQUESTS_CREATE_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [REQUESTS_CREATE_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.concat(payload.request),
      loading: false,
      error: null,
      success: true,
    }),
    [REQUESTS_CREATE_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [REQUESTS_MODIFY_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [REQUESTS_MODIFY_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: !state.data
        ? []
        : state.data.map((elem) => {
            if (elem.id === payload.id) {
              return {
                name: payload.request.name,
                location: payload.request.location,
                id: payload.id,
                logoUrl: payload.request.logoUrl,
                createdAt: payload.request.createdAt,
                email: elem.email,
              };
            }
            return elem;
          }),
      loading: false,
      error: null,
      success: true,
    }),
    [REQUESTS_MODIFY_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [REQUESTS_CLEAN_UP]: (state) => ({
      ...state,
      loading: false,
      error: null,
      success: false,
      deleted: false,
    }),
    [REQUESTS_CLEAR_DATA_LOGOUT]: () => ({
      ...initialState,
    }),
  },
  initialState
);
