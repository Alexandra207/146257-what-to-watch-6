import React, {useState} from 'react';
import {ratingNumberList} from '../../const/rating-consts';
import Logo from '../logo/logo';
import {connect} from "react-redux";
import {addReview} from "../../store/api-actions";
import {getIsErrorCommentPosting, getSelectedFilm} from '../../store/films-data-interaction/selectors';
import {AuthorizationStatus, ReviewLenght} from '../../const/utils';
import AvatarLogin from '../header/avatar-login';
import HeaderSignInLink from '../header/header-sign-in-link';
import PropTypes from 'prop-types';
import {FilmPropType} from '../../types/types';
import Header from '../header/header';
import {getAuthorizationStatus, getUserLoggedInInfo} from '../../store/user/selectors';


const ReviewAdding = ({onSubmitFormReview, isErrorCommentPosting, movieId, selectedMovie, authorizationStatus}) => {
  let idNumber = parseInt(movieId, 10);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [rating, setRating] = useState({
    ratingValue: 0,
    isRatingChecked: false
  });
  const [review, setReview] = useState([]);
  const {ratingValue, isRatingChecked} = rating;
  const handleTextareaChange = (evt) => {
    setReview(evt.target.value);
    if (review.length < ReviewLenght.MIN_LENGHT) {
      evt.target.setCustomValidity(`Please, introduce ${ReviewLenght.MIN_LENGHT - review.length} more symbols to complete your comment`);
    } else if (review.length > ReviewLenght.MAX_LENGHT) {
      evt.target.setCustomValidity(`Please, delete ${review.length - ReviewLenght.MAX_LENGHT} symbols to complete your comment`);
    } else {
      evt.target.setCustomValidity(``);
    }
    evt.target.reportValidity();
  };

  const handleFilmRatingInput = (evt) => {
    const {value, checked} = evt.target;
    setRating({ratingValue: value, isRatingChecked: checked});
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setIsFormDisabled(!isFormDisabled);
    onSubmitFormReview(
        idNumber,
        {
          rating: ratingValue,
          comment: review,
        }
    );

  };
  return (
    <section className="movie-card movie-card--full">
      <div className="movie-card__header">
        <div className="movie-card__bg">
          <img src={selectedMovie.backgroundImage} alt={selectedMovie.name} />
        </div>

        <h1 className="visually-hidden">WTW</h1>

        <Header >
          <Logo />

          <nav className="breadcrumbs">
            <ul className="breadcrumbs__list">
              <li className="breadcrumbs__item">
                <a href="movie-page.html" className="breadcrumbs__link">{selectedMovie.name}</a>
              </li>
              <li className="breadcrumbs__item">
                <a className="breadcrumbs__link">Add review</a>
              </li>
            </ul>
          </nav>

          {authorizationStatus === AuthorizationStatus.AUTH ? <AvatarLogin /> : <HeaderSignInLink/>}
        </Header>

        <div className="movie-card__poster movie-card__poster--small">
          <img src={selectedMovie.posterImage} alt={selectedMovie.name} width="218" height="327" />
        </div>
      </div>

      <div className="add-review">
        {isErrorCommentPosting && (
          <div >
            <p style={{color: `yellow`}}>We are so sorry, but there were produced some erros while sending your comment. <br/> Please, try to post it later or check if you fullfilled all the fields </p>
          </div>
        )}
        <form
          action="#"
          onSubmit={handleSubmit}
          className="add-review__htmlForm"
          disabled={isFormDisabled}
        >
          <div className="rating">
            <div className="rating__stars">
              {ratingNumberList.map((ratingNumber, index) =>
                <React.Fragment key={`${index}-${ratingNumber}`}>
                  <input
                    onChange={handleFilmRatingInput}
                    className="rating__input" id={`star-${ratingNumber}`}
                    type="radio"
                    name="rating"
                    value={ratingNumber}
                    defaultChecked={isRatingChecked && ratingNumber === ratingValue ? true : false}
                    disabled={isFormDisabled}
                  />
                  <label className="rating__label" htmlFor={`star-${ratingNumber}`}>{`Rating ${ratingNumber}`}</label>
                </React.Fragment>
              )}
            </div>
          </div>

          <div className="add-review__text">
            <textarea
              onChange={handleTextareaChange}
              className="add-review__textarea"
              name="review-text"
              id="review-text"
              placeholder="Review text"
              value={review}
              disabled={isFormDisabled}
            >
            </textarea>
            <div className="add-review__submit">
              <button
                className="add-review__btn"
                type="submit"
                disabled={isFormDisabled} >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

ReviewAdding.propTypes = {
  selectedMovie: FilmPropType,
  movieId: PropTypes.string.isRequired,
  isErrorCommentPosting: PropTypes.bool.isRequired,
  userLoggedInInfo: PropTypes.object.isRequired,
  onSubmitFormReview: PropTypes.func.isRequired,
  authorizationStatus: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => (
  {
    movieId: ownProps.match.params.id,
    selectedMovie: getSelectedFilm(state, parseInt(ownProps.match.params.id, 10)),
    isErrorCommentPosting: getIsErrorCommentPosting(state),
    userLoggedInInfo: getUserLoggedInInfo(state),
    authorizationStatus: getAuthorizationStatus(state),
  });

const mapDispatchToProps = (dispatch) => ({
  onSubmitFormReview(id, reviewData) {
    dispatch(addReview(id, reviewData));
  }
});

export {ReviewAdding};
export default connect(mapStateToProps, mapDispatchToProps)(ReviewAdding);
