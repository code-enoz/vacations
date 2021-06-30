import React from 'react'
import axios from 'axios'
import { API_ENDPOINT } from '../../config/constants';
import { store } from '../../redux/store';
import { AuthResponse } from '../../models/AuthResponse';
import UserLoginDetails from '../../models/userLoginDetails'
import LoginUtils from '../../utils/LoginUtils';
import { ActionType } from '../../redux/action-type';
import './Login.css'



interface LoginPageState {
    username: string
    password: string

}

class Login extends React.PureComponent<any, LoginPageState> {



    public constructor(props: any) {
        super(props)
        this.state = {

            username: 'ran',

            password: 'yelin',

        }
    }

    private registerUser = () => {
        this.props.history.push("/register")
    }

    private inputValidation = () => {
        if (this.state.username.trim() == "" || this.state.password.trim() == "") {
            alert("All fields must be fill correctly.")
            return
        }
    }



    private onUsernameChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let username = e.currentTarget.value
        this.setState({ username })

    }

    private onPasswordChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let password = e.currentTarget.value
        this.setState({ password })

    }


    private onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        this.inputValidation()
        const { username, password } = this.state
        e.preventDefault()

        console.debug(`submitting form with ${username}:${password} `)

        try {

            const endpoint = `${API_ENDPOINT}/users/login`


            const userLoginDetails = new UserLoginDetails(username, password);
            const resp = await axios.post<AuthResponse>(endpoint, userLoginDetails);
            console.log(`received AuthResponse: ${JSON.stringify(resp)}`)

            const { authToken, userType, firstName } = resp.data



            LoginUtils.setUserCache(authToken, firstName)
            store.dispatch({ type: ActionType.updateIsUserLoggedIn })


            store.dispatch({ type: ActionType.connectToSocket, payload: { authToken: authToken } })


            if (userType == "admin") {
                this.props.history.push('./admin')
            }
            else if (userType == "client") {
                this.props.history.push('/client')
            }
        } catch (ex) {
            console.error('could not login', ex)
        }



    }





    render() {
        const { username, password } = this.state


        const pageMessage = 'Login'

        return (

            <div className="login-page">
                <div className="bg-img">
                    <h3 className="login-title"> Hello Guest</h3>
                    <br></br> <br></br> <br></br> <br></br>

                    <form className="login-form" onSubmit={this.onFormSubmit}>
                        <div className="title">Please {pageMessage}:</div>

                        <input
                            type="text"
                            name="username"
                            placeholder="username"
                            defaultValue={username}
                            onKeyUp={e => this.onUsernameChange(e)}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            defaultValue={password}
                            onKeyUp={e => this.onPasswordChange(e)}
                        />


                        <input type="submit" value="login" />
                        <h5>Not a member? please signup:</h5>
                        <input type="button" value="Register" onClick={this.registerUser}></input>

                    </form>

                </div>
            </div>
        )
    }
}

export default Login