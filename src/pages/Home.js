/**
 * Created by Cris on 2017/3/26.
 */
import React from 'react';
import { Link } from 'react-router';

class Home extends React.Component {
    render () {
        return (
            <div>
                <header>
                    <h1>Welcome</h1>
                </header>

                <main>
                    <Link to="/user/add">Add User</Link>
                </main>
            </div>
        );
    }
}

export default Home;