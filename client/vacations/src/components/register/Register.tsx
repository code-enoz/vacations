import axios from 'axios'
import React, { ChangeEvent, Component } from 'react'
import { API_ENDPOINT } from '../../config/constants'
import UserSignupDetails from '../../models/UserSignupDetails'
import { store } from '../../redux/store';
import { AuthResponse } from '../../models/AuthResponse';
import LoginUtils from '../../utils/LoginUtils';
import { ActionType } from '../../redux/action-type';
import './Register.css'


interface registerState {
    firstName?: string,
    familyName?: string,
    username: string,
    password: string
}

export default class Register extends Component<any, registerState> {

    public constructor(props: any) {
        super(props)


        this.state = {
            firstName: "",
            familyName: "",
            username: "",
            password: ""
        }


    }

    private inputValidation = () => {
        if (this.state.firstName.trim() == "" || this.state.familyName.trim() == "" || this.state.username.trim() == "" || this.state.password.trim() == "") {
            alert("All fields must be fill correctly.")
            return
        }

        if (this.state.firstName.length < 2 || this.state.familyName.length < 2 || this.state.username.length < 2 || this.state.password.length < 2) {
            alert("All fields must contain at least 2 characters.")
            return
        }

        if (this.state.firstName.length > 20 || this.state.familyName.length > 20 || this.state.username.length > 20 || this.state.password.length > 20) {
            alert("All fields must contain at most 20 characters.")
            return
        }

    }

    private onFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        let firstName = e.currentTarget.value
        this.setState({ firstName })
    }

    private onFamilyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        let familyName = e.currentTarget.value
        this.setState({ familyName })
    }

    private onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        let username = e.currentTarget.value
        this.setState({ username })
    }

    private onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        let password = e.currentTarget.value
        this.setState({ password })
    }

    private onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        this.inputValidation()

        const { firstName, familyName, username, password } = this.state

        e.preventDefault()

        try {


            const endpoint = `${API_ENDPOINT}/users/register`
            const newUser = new UserSignupDetails(username, password, firstName, familyName)
            const response = await axios.post<AuthResponse>(endpoint, newUser)

            const { authToken, userType } = response.data




            LoginUtils.setUserCache(authToken, firstName)
            store.dispatch({ type: ActionType.updateIsUserLoggedIn })



            if (userType == "admin") {
                this.props.history.push('./admin')
            }
            else if (userType == "client") {
                this.props.history.push('/client')
            }

        }
        catch (ex) {
            console.error('could not register', ex)
        }

    }


    private loginUser = () => {
        this.props.history.push("/home")
    }



    render() {
        return (

            <div className="registrationContainer">

                <form className="registerForm" onSubmit={this.onFormSubmit}>
                    <br></br> <br></br> <br></br> <br></br>
                    <h3> Please Register:</h3>
                    <input placeholder="first name" className="firstName" value={this.state.firstName} onChange={this.onFirstNameChange} ></input>
                    <input placeholder="family name" className="familyName" value={this.state.familyName} onChange={this.onFamilyNameChange} ></input>
                    <input placeholder="username" className="username" value={this.state.username} onChange={this.onUsernameChange} ></input>
                    <input placeholder="password" className="password" value={this.state.password} onChange={this.onPasswordChange}></input>
                    <input type="submit" value="register" />
                    <h5>already registered? <br></br> please login:</h5>
                    <input type="button" value="Login" onClick={this.loginUser}></input>
                </form>
            </div>

        )
    }
}