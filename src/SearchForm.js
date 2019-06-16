import React, { Component } from 'react';
import { Form, FormControl } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
// import history from './history'


class SearchForm extends Component {
   constructor(props) {
      super(props);
      // the following needed otherwise handleFormSubmit doesn't have a this
      this.handleFormSubmit = this.handleFormSubmit.bind(this);

      this.initialState = {
         searchTitle: '',
         searchYear: '',
         searchPage: '',   // the omdb API only returns 10 entries at a time per "page"
         redirectToPage: false,
         pageToRedirect: ""
      }
      this.state = this.initialState;
   }

   handleFormSubmit = event => {
      event.preventDefault()
      let searchTitle = event.target.elements[0].value
      this.setState({
         redirectToPage: false,
         pageToRedirect: "/shows/" + searchTitle,
      })
      this.props.history.push("/shows/" + searchTitle)
   }

   handleChange = event => {
      const { name, value } = event.target;

      this.setState({
         [name]: value
      });
   }

   render() {
      return (
         <Form href="#search" onSubmit={this.handleFormSubmit} inline className_="mx-0" >
            <FormControl onChange={this.handleChange} bg="dark" type="text" name="searchTitle" placeholder="Search TV show"/>
         </Form>
      );
   }
}

export default withRouter(SearchForm)
