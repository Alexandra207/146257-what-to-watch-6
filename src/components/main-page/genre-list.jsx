import React from 'react';
import {connect} from 'react-redux';

import {changeGenre} from '../../store/action';
import PropTypes from 'prop-types';
import {getAllGenresFromState, getCurrentGenreSelector} from '../../store/films-data-interaction/selectors';

const GenreList = (props) => {
  const {allGenres, activeGenre, onGenreClick, resetFilmsCount} = props;

  return (
    <ul className="catalog__genres-list" >
      {allGenres.map((genre) => {
        return <li
          key={genre}
          className={`catalog__genres-item
          ${genre === activeGenre ? `catalog__genres-item--active` : ``}`}
          onClick={(evt) => {
            evt.preventDefault();
            onGenreClick(genre);
            resetFilmsCount();
          }}
        >
          <a href="#" className="catalog__genres-link">{genre}</a>
        </li>;
      })}
    </ul>
  );
};

GenreList.propTypes = {
  activeGenre: PropTypes.string.isRequired,
  allGenres: PropTypes.arrayOf(PropTypes.string),
  onGenreClick: PropTypes.func,
  resetFilmsCount: PropTypes.func,
};


const mapStateToProps = (state) => ({
  activeGenre: getCurrentGenreSelector(state),
  allGenres: getAllGenresFromState(state),
});

const mapDispatchToProps = (dispatch) => ({
  onGenreClick(genre) {
    dispatch(changeGenre(genre));
  }
});
export {GenreList};
export default connect(mapStateToProps, mapDispatchToProps)(GenreList);
