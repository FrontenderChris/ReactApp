import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import HomePage from './pages/Home';
import UserList from './pages/UserList';
import UserAddPage from './pages/UserAdd';
import UserEditPage from './pages/UserEdit';
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={HomePage}/>
        <Route path="/user/add" component={UserAddPage}/>
        <Route path="/user/list" component={UserList}/>
        <Route path="/user/edit/:id" component={UserEditPage}/>
    </Router>
), document.getElementById('app'));