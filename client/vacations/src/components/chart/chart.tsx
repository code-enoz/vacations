import React, { Component } from 'react';
import axios from 'axios'
import { Bar } from 'react-chartjs-2';
import { API_ENDPOINT } from '../../config/constants';
import VacationFollowed from '../../models/VacationFollowed'
import LoginUtils from '../../utils/LoginUtils'
import './chart.css'
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux'
import Vacation from '../../models/vacation';
import { ActionType } from '../../redux/action-type';

interface chartState {

    socket: any,
    vacationsFollowed: VacationFollowed[],
    labels: any,
    values: any

}


const graphOptions: any = {
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                min: 0,
                stepSize: 1
            }
        }]
    }
}





export default class chart extends Component<any, chartState>{

    private unsubscribe: Unsubscribe

    constructor(props: any) {
        super(props);

        this.state = {

            socket: store.getState().socket,
            vacationsFollowed: [],
            labels: [],
            values: []
        }


    }


    componentWillUnmount() {
        this.unsubscribe()
    }



    componentDidMount() {
        this.unsubscribe = store.subscribe(() =>
            this.setState({ socket: store.getState().socket })
        )
        if (
            this.state.socket == undefined ||
            this.state.socket.connected == false
        ) {
            let authToken = LoginUtils.getUserCacheAuthToken();
            store.dispatch({
                type: ActionType.connectToSocket,
                payload: {
                    authToken: authToken
                },
            });
        }
        this.getFollowedVacations();
        this.registerSocketListeners();
    }



    private registerSocketListeners = () => {
        this.state.socket.on("follow-vacation", (vacation: Vacation) => {

            let newState = { ...this.state }
            if (newState.labels.includes(vacation.destination)) {
                let index = newState.labels.indexOf(vacation.destination)
                newState.values[index] = newState.values[index] + 1;
            }
            else {
                newState.labels.push(vacation.destination)
                newState.values.push(1);
            }

            this.setState(newState)
        })
        this.state.socket.on("unfollow-vacation", (vacation: Vacation) => {

            let newState = { ...this.state }
            let index = newState.labels.indexOf(vacation.destination)
            if (newState.values[index] == 1) {
                newState.labels.splice(index, 1)
                newState.values.splice(index, 1)
            }
            else if (newState.values[index] > 1) {
                newState.values[index] = newState.values[index] - 1
            }
            this.setState(newState)
        })

    }



    private getFollowedVacations = async () => {




        try {
            LoginUtils.setTokenToHeader()
            const endpoint = `${API_ENDPOINT}/vacations/followed`


            const resp = await axios.get<VacationFollowed[]>(endpoint);
            console.log(`received AuthResponse: ${JSON.stringify(resp)}`)

            this.setState({ vacationsFollowed: resp.data })


            if (resp.data.length > 0) {
                const newState = { ...this.state }

                for (let vacation of resp.data) {
                    newState.labels.push(vacation.destination);
                    newState.values.push(vacation.followersAmount);
                    console.log(vacation.destination)
                }
                console.log("!!!!!!!!!!!!!!!!!!!!!!!")
                this.setState(newState)
            }


        } catch (ex) {
            console.error('could not recieve followed vacations data', ex)
        }



    }



    render() {
        return (
            <div className="container">

                <h3> Go Back:<br></br><i className="far fa-hand-point-left fa-2x pointerBack" onClick={() => { this.props.history.push("/admin") }}>  </i></h3>
                <h3 className="title"> Following data:</h3>

                <div className="chartContainer">


                    <Bar redraw
                        data={{
                            labels: this.state.labels,
                            datasets: [
                                {
                                    label: 'Amount of followers',
                                    backgroundColor: 'rgba(75,192,192,0.4)',
                                    borderColor: 'rgba(75,192,192,1)',
                                    borderWidth: 1,
                                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                                    hoverBorderColor: 'rgba(255,99,132,1)',
                                    data: this.state.values
                                },
                            ],
                        }}
                        height={350}
                        options={

                            graphOptions
                        }
                    />

                </div>
            </div>
        )
    }

}