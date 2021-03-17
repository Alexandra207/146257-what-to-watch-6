import {AuthorizationStatus, MAX_FILMS} from "../const/utils";
import {filmsMock} from "../mocks/films";
import {promoFilm} from "../mocks/promo-film";
import {ActionType} from "./action";

const initialState = {
  genre: `All genres`,
  filmList: filmsMock,
  promoFilmMock: promoFilm,
  filmsShownCount: MAX_FILMS,
  authorizationStatus: AuthorizationStatus.NO_AUTH,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.CHANGE_GENRE:
      return {
        ...state,
        genre: action.payload
      };

    case ActionType.GET_NEW_FILMLIST_BY_GENRE:
      return {
        ...state,
        filmList: state.filmList
      };
    case ActionType.SHOW_MORE_MOVIES:
      return {
        ...state,
        filmsShownCount: state.filmsShownCount + action.payload
      };
    case ActionType.RESET_SHOW_MORE_MOVIES_BUTTON:
      return {
        ...state,
        filmsShownCount: MAX_FILMS,
      };
    case ActionType.RESET_GENRE:
      return {
        ...state,
        genre: `All genres`
      };
    case ActionType.LOAD_FILMS:
      return {
        ...state,
        filmList: action.payload,
      };
    case ActionType.REQUIRED_AUTHORIZATION:
      return {
        ...state,
        authorizationStatus: action.payload,
      };
    default:
      return state;
  }

};

export {reducer};
