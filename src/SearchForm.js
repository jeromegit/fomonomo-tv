import React, { Component } from 'react';
import { Form, FormControl } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

export default class SearchForm extends Component {
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
            this.setState({ redirectToPage: true,
         pageToRedirect: "/shows/"+searchTitle,
      })
   }

   handleChange = event => {
      const { name, value } = event.target;

      this.setState({
         [name]: value
      });
   }

   render() {
      return (
         <div>
            <Form href="#search" onSubmit={this.handleFormSubmit} inline>
               <FormControl onChange={this.handleChange} bg="dark" type="text" name="searchTitle" placeholder="Search TV show"
                  className_="mr-sm-2" />
            </Form>
            {this.state.redirectToPage && (
               <Redirect to={this.state.pageToRedirect} />
            )}
         </div>
      );
   }
}

