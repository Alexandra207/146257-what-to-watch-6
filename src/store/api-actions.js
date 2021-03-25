import browserHistory from '../browser-history';
import {AuthorizationStatus} from '../const/utils';
import {APIRoute, FILMS_PATH, Routes} from './../const/routes-path';
import {ActionCreator} from './action';


export const initApp = () => (dispatch, _getState, api) => {
  api.get(APIRoute.FILMS).then(({data}) => {
    dispatch(checkAuth());
    dispatch(ActionCreator.loadFilms(data));
    dispatch(fetchPromoFilm()).then(() => {
      dispatch(ActionCreator.setApplicationReady(true));
    });
  });
};

export const fetchPromoFilm = () => (dispatch, _getState, api) => (
  api.get(APIRoute.FILM_PROMO)
    .then(({data}) => dispatch(ActionCreator.loadPromoFilm((data))))
);

export const fetchFavoriteFilmList = () => (dispatch, _getState, api) => (
  api.get(APIRoute.FAVORITE_FILMS)
    .then(({data}) => dispatch(ActionCreator.loadFavoriteFilms((data))))
);

export const fetchReviewList = (id) => (dispatch, _getState, api) =>
  api
    .get(`${APIRoute.COMMENTS}/${id}`)
    .then(({data}) => dispatch(ActionCreator.loadReviews(data)));


export const checkAuth = () => (dispatch, _getState, api) => {
  api.get(Routes.LOG_IN)
    .then(({data}) => dispatch(ActionCreator.loadUserInfo(data)))
    .then(() =>{
      dispatch(ActionCreator.requireAuthorization(AuthorizationStatus.AUTH));
      // dispatch(ActionCreator.loadUserInfo(data));
    })
    .catch(() => {});
};

export const login = ({login: email, password}) => (dispatch, _getState, api) => (
  api.post(Routes.LOG_IN, {email, password})
    .then(() => dispatch(ActionCreator.requireAuthorization(AuthorizationStatus.AUTH)))
    .then(() => dispatch(ActionCreator.checkAuthorization(false)))
    .then(() => dispatch(fetchUserLoggedInInfo()))
    .then(() => browserHistory.goBack())
    .catch((error) => {
      dispatch(ActionCreator.checkAuthorization(true));
      throw error;
    })
);


export const fetchUserLoggedInInfo = () => (dispatch, _getState, api) =>
  api
    .get(Routes.LOG_IN)
    .then(({data}) => dispatch(ActionCreator.loadUserInfo(data)));

export const addReview = (id, {rating, comment}) => (dispatch, _getState, api) => {
  return api.post(`${APIRoute.COMMENTS}/${id}`, {rating, comment})
   .then(() => {
     dispatch(ActionCreator.checkErrorCommentPost(false));
     dispatch(fetchReviewList(id));
     browserHistory.push(`/${FILMS_PATH}/${id}`);
   })
    .catch((error) => {
      dispatch(ActionCreator.checkErrorCommentPost(true));

      throw error;
    });
};

export const addNewFavoriteFilm = (id, isFilmFavorite) => (dispatch, _getState, api) => {
  const status = isFilmFavorite ? 1 : 0;
  dispatch(ActionCreator.postFavoriteFilm(true));
  return api.post(`/favorite/${id}/${status}`)
   .then(() => {
     dispatch(ActionCreator.postFavoriteFilm(false));
     dispatch(fetchFavoriteFilmList());
   })
    .catch((error) => {

      throw error;
    });
};
