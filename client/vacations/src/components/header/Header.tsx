import React, { Component } from 'react'
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux'
import "./Header.css"

interface HeaderState {
    isUserLoggedIn: boolean,
    username: string
}



export default class Header extends Component<any, HeaderState> {

    private unsubscribeStore: Unsubscribe;


    constructor(props: any) {
        super(props)

        this.state = {
            isUserLoggedIn: store.getState().isUserLoggedIn,
            username: ""
        }







    }




    componentDidMount() {
        console.log(this.state.isUserLoggedIn)
        this.unsubscribeStore = store.subscribe(() => this.setState(
            {
                isUserLoggedIn: store.getState().isUserLoggedIn
            })
        );
    }

    componentWillUnmount() {
        this.unsubscribeStore()
    }



    render() {
        return (

            <div className="headerContainer">

                {this.state.isUserLoggedIn &&

                    <h3>hello {localStorage.getItem("LOCAL_STORAGE_FIRST_NAME")} </h3>


                }
                {!this.state.isUserLoggedIn &&
                    <h3>hello guest</h3>
                }

                <p></p>
            </div>
        )
    }
}
