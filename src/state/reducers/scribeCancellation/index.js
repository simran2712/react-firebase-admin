import { createReducer } from 'redux-act';

import {
  CANCELLATIONS_FETCH_DATA_INIT,
  CANCELLATIONS_FETCH_DATA_SUCCESS,
  CANCELLATIONS_FETCH_DATA_FAIL,
  CANCELLATIONS_DELETE_USER_INIT,
  CANCELLATIONS_DELETE_USER_SUCCESS,
  CANCELLATIONS_DELETE_USER_FAIL,
  CANCELLATIONS_CREATE_USER_INIT,
  CANCELLATIONS_CREATE_USER_SUCCESS,
  CANCELLATIONS_CREATE_USER_FAIL,
  CANCELLATIONS_MODIFY_USER_INIT,
  CANCELLATIONS_MODIFY_USER_SUCCESS,
  CANCELLATIONS_MODIFY_USER_FAIL,
  CANCELLATIONS_CLEAN_UP,
  CANCELLATIONS_CLEAR_DATA_LOGOUT,
} from 'state/actions/scribeCancellation';

const initialState = {
  data: [],
  loading: false,
  error: null,
  success: false,
  deleted: false,
};

export const cancellationsReducer = createReducer(
  {
    [CANCELLATIONS_FETCH_DATA_INIT]: () => ({
      ...initialState,
      loading: true,
    }),
    [CANCELLATIONS_FETCH_DATA_SUCCESS]: (state, payload) => ({
      ...state,
      data: payload.data,
      loading: false,
      error: null,
    }),
    [CANCELLATIONS_FETCH_DATA_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [CANCELLATIONS_DELETE_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [CANCELLATIONS_DELETE_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.filter((elem) => elem.id !== payload.id),
      loading: false,
      error: null,
      deleted: true,
    }),
    [CANCELLATIONS_DELETE_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [CANCELLATIONS_CREATE_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [CANCELLATIONS_CREATE_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.concat(payload.request),
      loading: false,
      error: null,
      success: true,
    }),
    [CANCELLATIONS_CREATE_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [CANCELLATIONS_MODIFY_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [CANCELLATIONS_MODIFY_USER_SUCCESS]: (state, payload) => ({
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
    [CANCELLATIONS_MODIFY_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [CANCELLATIONS_CLEAN_UP]: (state) => ({
      ...state,
      loading: false,
      error: null,
      success: false,
      deleted: false,
    }),
    [CANCELLATIONS_CLEAR_DATA_LOGOUT]: () => ({
      ...initialState,
    }),
  },
  initialState
);
