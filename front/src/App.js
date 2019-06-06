import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Navbar, Nav, NavItem, NavLink, Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import Movie from './Movie';
import Helmet from 'react-helmet';

class App extends Component{
  constructor(props){
    super(props);
    this.state={
      isOpenPopOver:false,
      viewOnlyLike:false,
      moviesCount:0,
      moviesNameList: [],
      movies: [],
      moviesLiked: []
    };
  }

  componentDidMount(){
    //We need to collect all the movies of the API and all the movies present in the DB we call upon the backend that needs to be running locally on the port 3000
    var ctx = this;
    fetch('http://localhost:3000/movies')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      ctx.setState({movies: data.movies})
    })
    .catch(function(error) {
      console.log('Request failed', error)
    });

    fetch('http://localhost:3000/mymovies')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var moviesNameListCopy = data.data.map((movie) => {
        return movie.title;
      });
      ctx.setState({
        moviesLiked: data.data,
        moviesCount: data.data.length,
        moviesNameList: moviesNameListCopy})
    })
    .catch(function(error) {
      console.log('Request failed', error)
    });
  }

  togglePopOver = () => {
    this.setState({isOpenPopOver:!this.state.isOpenPopOver})
  }

  handleClickLikeOn = () => {
    this.setState({viewOnlyLike:true})
  }

  handleClickLikeOff = () => {
    this.setState({viewOnlyLike:false})
  }

  handleClick = (isLiked, name) => {
    var moviesNameListCopy = [...this.state.moviesNameList];

    if (isLiked) {
      moviesNameListCopy.push(name);
      this.setState({
        moviesCount: this.state.moviesCount+1,
        moviesNameList: moviesNameListCopy,
      })
    } else {
      var index = moviesNameListCopy.indexOf(name)
      moviesNameListCopy.splice(index, 1);
      this.setState({
        moviesCount: this.state.moviesCount-1,
        moviesNameList: moviesNameListCopy,
      })
    }
  }

  render(){

    var movielist= this.state.movies.map((movie,i)=>{
      var isLiked = false;
      for (var y = 0; y < this.state.moviesLiked.length; y++) {
        if (movie.id === this.state.moviesLiked[y].idMovieDB) {
          isLiked = true;
          break;
        }
      }
      //We send to the child component Movie all the movies it needs to display
      return(<Movie
        key={i}
        movieName ={movie.original_title}
        movieDesc = {movie.overview}
        movieImg= {movie.poster_path}
        movieId={movie.id}
        displayOnlyLike= {this.state.viewOnlyLike}
        handleClickParent={this.handleClick}
        movieLiked={isLiked}
      />)
    })

    var moviesLast = this.state.moviesNameList.slice(-3)
    if (this.state.moviesCount === 0) {
      moviesLast = "Aucun film sélectionné.";
    } else if (this.state.moviesCount > 3) {
      moviesLast = moviesLast.join(", ") + "...";
    } else {
      moviesLast = moviesLast.join(", ") + ".";
    }

    return (
      <div>
        <Helmet bodyAttributes={{style: 'background-color : #131A20'}}/>
        <div style={{marginBottom: 90}}>
          <Navbar color="dark" dark expand="md" fixed='top'>
            <span className="navbar-brand">
              <img src="./img/logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo myMoviz"/>
            </span>
            <Nav className="" navbar>
              <NavItem>
                <NavLink style={{color: "#FFFFFF"}} onClick={this.handleClickLikeOff} href="#">Last Releases</NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{color: "#FFFFFF"}} href="#" onClick= {this.handleClickLikeOn}>My movies</NavLink>
              </NavItem>
              <Button id="Popover1" onClick={this.togglePopOver} color="secondary">{this.state.moviesCount}{this.state.moviesCount > 1 ? ' films' : ' film'}</Button>
              <Popover placement="bottom" isOpen={this.state.isOpenPopOver} target="Popover1" toggle={this.togglePopOver}>
                <PopoverHeader>Derniers films</PopoverHeader>
                <PopoverBody>{moviesLast}</PopoverBody>
              </Popover>
            </Nav>
          </Navbar>
        </div>

        <Container>
          <Row>
            {movielist}
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
