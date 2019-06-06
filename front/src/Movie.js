import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Col,Card, CardImg, CardBody, CardTitle, CardText} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

class Movie extends Component{
  constructor(props){
    super(props);
    this.state={
      isLiked: this.props.movieLiked,
    };
  }
//Depending on the value of isLiked we add a new movie to the DB or we delete one
  handleClick = () => {
    var isLiked= !this.state.isLiked;
    this.setState({isLiked: isLiked })
    this.props.handleClickParent(isLiked, this.props.movieName);
    if(isLiked){
      fetch('http://localhost:3000/mymovies', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `title=${this.props.movieName}&overview=${this.props.movieDesc}&poster_path=${this.props.movieImg}&idMovieDB=${this.props.movieId}`
      });
    } else {
      fetch(`http://localhost:3000/mymovies/${this.props.movieId}`, {
        method: 'DELETE'})
        .catch((error) => {
        console.error(error);
      });
    }
  }

  render () {
    var color;
    var opacity;
    if(this.state.isLiked){
      color= '#fc6861'
      opacity='1'
    } else {
      color= '#F7F7F7'
      opacity= '0.6'
    }

    var styleHeart = {
      color: color,
      opacity: opacity,
      position: 'absolute',
      top: '5%',
      left: '80%',
      cursor: 'pointer'
    }

    var display;
    if(this.props.displayOnlyLike && !this.state.isLiked){
      display='none'
    }

    return (
      <Col xs="12" sm="6" md="4" lg="3" style={{display:display}}>
        <div style={{marginBottom:30}}>
          <Card>
            <CardImg top width="100%" src={`https://image.tmdb.org/t/p/w500/${this.props.movieImg}`} alt="Card image cap" style={{minHeight: 380}} />
            <FontAwesomeIcon size="2x" style={styleHeart} icon={faHeart} onClick={this.handleClick} />
            <CardBody style={{height: 250}}>
              <CardTitle style={{fontSize: 20}}>{this.props.movieName}</CardTitle>
              <CardText>{this.props.movieDesc.substr(0, 100) + ' ...'}</CardText>
            </CardBody>
          </Card>
        </div>
      </Col>
    );
  }
}

export default Movie;
