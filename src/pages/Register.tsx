import React, {Component, SyntheticEvent} from 'react';
import axios from 'axios';
import {Navigate} from "react-router-dom";

class Register extends Component {
    first_name = '';
    last_name = '';
    email = '';
    password = '';
    password_confirm = '';
    state = {
        redirect: false
    };

    submit = async (event: SyntheticEvent) => {
        event.preventDefault();

        await axios.post('register', {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            password: this.password,
            password_confirm: this.password_confirm,
        });

        this.setState({
            redirect: true
        });
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={"/login"}/>;
        }

        return (
            <main className="form-signin w-100 m-auto">
                <form onSubmit={this.submit}>
                    <h1 className="h3 mb-3 fw-normal">Please register</h1>

                    <div className="form-floating">
                        <input type="text" className="form-control" placeholder="First Name"
                               onChange={event => this.first_name = event.target.value}
                        />
                        <label>First Name</label>
                    </div>

                    <div className="form-floating">
                        <input type="text" className="form-control" placeholder="Last Name"
                               onChange={event => this.last_name = event.target.value}
                        />
                        <label>Last Name</label>
                    </div>

                    <div className="form-floating">
                        <input type="email" className="form-control" placeholder="name@example.com"
                               onChange={event => this.email = event.target.value}
                        />
                        <label>Email address</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" placeholder="Password"
                               onChange={event => this.password = event.target.value}
                        />
                        <label>Password</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" placeholder="Password Confirm"
                               onChange={event => this.password_confirm = event.target.value}
                        />
                        <label>Password Confirm</label>
                    </div>

                    <button className="btn btn-primary w-100 py-2" type="submit">Submit</button>
                </form>
            </main>
        )
            ;
    }
}

export default Register;