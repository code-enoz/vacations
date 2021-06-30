import React, { Component } from 'react'
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom'
import './layout.css'
import Admin from '../admin/Admin'
import Client from '../client/Client'
import Login from '../login/Login'
import PageNotFound from '../pageNotFound/PageNotFound'
import Register from '../register/Register'
import TestCss from '../testCss/testCss'
import Chart from '../chart/chart'

export default class Layout extends Component {
    render() {
        return (

            <BrowserRouter>


                <section className="layout">

                    <main>
                        <Switch>
                            <Redirect path="/" to="/home" exact />
                            <Route path="/home" component={Login} exact />
                            <Route path="/register" component={Register} exact />
                            <Route path="/admin" component={Admin} exact />
                            <Route path="/client" component={Client} exact />
                            <Route path="/testCss" component={TestCss} exact />
                            <Route path="/chart" component={Chart} exact />
                            <Route component={PageNotFound} />
                        </Switch>
                    </main>
                </section>
            </BrowserRouter>

        )
    }
}


