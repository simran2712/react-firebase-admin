import { createReducer } from 'redux-act';

import {
  REVIEWS_FETCH_DATA_INIT,
  REVIEWS_FETCH_DATA_SUCCESS,
  REVIEWS_FETCH_DATA_FAIL,
  REVIEWS_DELETE_USER_INIT,
  REVIEWS_DELETE_USER_SUCCESS,
  REVIEWS_DELETE_USER_FAIL,
  REVIEWS_CREATE_USER_INIT,
  REVIEWS_CREATE_USER_SUCCESS,
  REVIEWS_CREATE_USER_FAIL,
  REVIEWS_MODIFY_USER_INIT,
  REVIEWS_MODIFY_USER_SUCCESS,
  REVIEWS_MODIFY_USER_FAIL,
  REVIEWS_CLEAN_UP,
  REVIEWS_CLEAR_DATA_LOGOUT,
} from 'state/actions/reviews';

const initialState = {
  data: [],
  loading: false,
  error: null,
  success: false,
  deleted: false,
};

export const reviewsReducer = createReducer(
  {
    [REVIEWS_FETCH_DATA_INIT]: () => ({
      ...initialState,
      loading: true,
    }),
    [REVIEWS_FETCH_DATA_SUCCESS]: (state, payload) => ({
      ...state,
      data: payload.data,
      loading: false,
      error: null,
    }),
    [REVIEWS_FETCH_DATA_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [REVIEWS_DELETE_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [REVIEWS_DELETE_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.filter((elem) => elem.id !== payload.id),
      loading: false,
      error: null,
      deleted: true,
    }),
    [REVIEWS_DELETE_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [REVIEWS_CREATE_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [REVIEWS_CREATE_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: state.data.concat(payload.review),
      loading: false,
      error: null,
      success: true,
    }),
    [REVIEWS_CREATE_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [REVIEWS_MODIFY_USER_INIT]: (state) => ({
      ...state,
      loading: true,
    }),
    [REVIEWS_MODIFY_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: !state.data
        ? []
        : state.data.map((elem) => {
            if (elem.id === payload.id) {
              return {
                name: payload.review.name,
                location: payload.review.location,
                id: payload.id,
                logoUrl: payload.review.logoUrl,
                createdAt: payload.review.createdAt,
                email: elem.email,
              };
            }
            return elem;
          }),
      loading: false,
      error: null,
      success: true,
    }),
    [REVIEWS_MODIFY_USER_FAIL]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [REVIEWS_CLEAN_UP]: (state) => ({
      ...state,
      loading: false,
      error: null,
      success: false,
      deleted: false,
    }),
    [REVIEWS_CLEAR_DATA_LOGOUT]: () => ({
      ...initialState,
    }),
  },
  initialState
);
