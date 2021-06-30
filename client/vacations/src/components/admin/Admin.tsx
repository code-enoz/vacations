import React, { Component, ChangeEvent } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Vacation from '../../models/vacation'
import LoginUtils from '../../utils/LoginUtils'
import { API_ENDPOINT } from '../../config/constants'
import axios from 'axios'
import VacationUtils from '../../utils/VacationUtils'
import "./Admin.css"
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import { Unsubscribe } from 'redux'
import { Card } from 'react-bootstrap';



interface AdminState {
    socket: any,
    creatorModal: boolean,
    showModal: boolean,
    vacations: Vacation[],
    description: string,
    destination: string,
    imageUrl: string,
    departureDate: string,
    returnDate: string,
    price: number,
    id: number,
    selectedFile: any
}


export default class Admin extends Component<any, AdminState> {

    private unsubscribe: Unsubscribe

    constructor(props: any) {
        super(props)




        this.state = {
            socket: store.getState().socket,
            creatorModal: false,
            showModal: false,
            vacations: [],
            description: "",
            destination: "",
            imageUrl: "",
            departureDate: "2016-01-04 10:34:23",
            returnDate: "2016-01-04 10:34:24",
            price: 0,
            id: 0,
            selectedFile: null
        }
        this.unsubscribe = store.subscribe(() =>
            this.setState({ socket: store.getState().socket })
        )
    }

    componentDidMount() {
        this.initPage()
    }

    componentWillUnmount() {
        this.unsubscribe()
    }


    private initPage = async () => {

        try {


            if (
                this.state.socket === undefined ||
                this.state.socket.connected === false
            ) {
                store.dispatch({
                    type: ActionType.connectToSocket,
                    payload: {
                        authToken: LoginUtils.getUserCacheAuthToken()
                    },
                });
            }

            LoginUtils.setTokenToHeader()
            const endpoint = `${API_ENDPOINT}/vacations`
            const response = await axios.get<Vacation[]>(endpoint);
            console.log(`received vacations: ${JSON.stringify(response)}`)

            this.setState({ vacations: response.data })
            this.registerSocketListeners()
        }
        catch (e) {
            console.log(e)
        }



    }


    private registerSocketListeners = () => {
        this.state.socket.on("add-new-vacation", (newVacation: Vacation) => {
            newVacation.departureDate = VacationUtils.fixDateFormat(newVacation.departureDate)
            newVacation.returnDate = VacationUtils.fixDateFormat(newVacation.returnDate)
            let newState = { ...this.state }
            newState.vacations.push(newVacation)
            this.setState(newState)
        })
        this.state.socket.on("delete-vacation", (vacation: Vacation) => {

            let newState = { ...this.state }
            let index = VacationUtils.getVacationIndex(newState, vacation)
            newState.vacations.splice(index, 1)
            this.setState(newState)
        })
        this.state.socket.on("update-vacation", (vacation: Vacation) => {

            vacation.departureDate = VacationUtils.fixDateFormat(vacation.departureDate)
            vacation.returnDate = VacationUtils.fixDateFormat(vacation.returnDate)
            let newState = { ...this.state }
            let index = VacationUtils.getVacationIndex(newState, vacation)
            newState.vacations[index] = vacation
            this.setState(newState)

        })
    }



    private handleModal = () => {
        this.setState({ showModal: !this.state.showModal })
    }

    private handleCreatorModal = () => {
        this.setState({ description: "", destination: "", imageUrl: "", departureDate: "", returnDate: "", price: undefined })
        this.setState({ creatorModal: !this.state.creatorModal })
    }

    private onUpdateVacationClicked = async (vacation: Vacation) => {

        this.setState({ description: vacation.description, destination: vacation.destination, imageUrl: vacation.imageUrl, departureDate: vacation.departureDate, returnDate: vacation.returnDate, price: vacation.price, id: vacation.id })

        this.setState({ showModal: !this.state.showModal })

    }


    private createVacation = async () => {
        try {
            const { description, destination, imageUrl, departureDate, returnDate, price } = this.state
            const endpoint = `${API_ENDPOINT}/vacations`
            const vacation = new Vacation(description, destination, imageUrl, departureDate, returnDate, price)
            let newVacation = await axios.post(endpoint, vacation)

            console.log("check the database")



            this.state.socket.emit("add-new-vacation", newVacation.data)
            console.log(this.state.vacations)
        }

        catch (err) {
            console.log('encountered problem while trying to create vacation:' + err)
        }
    }

    private updateVacation = async () => {
        try {
            const { description, destination, imageUrl, departureDate, returnDate, price, id } = this.state
            const endpoint = `${API_ENDPOINT}/vacations/update`
            const vacation = new Vacation(description, destination, imageUrl, departureDate, returnDate, price, id)
            await axios.post(endpoint, vacation)
            console.log("check data base")
            this.state.socket.emit("update-vacation", vacation)
        }
        catch (err) {
            console.log('encountered problem while trying to update vacation:' + err)
        }
    }

    private onDeleteVacationClicked = async (vacation: Vacation) => {
        try {
            const endpoint = `${API_ENDPOINT}/vacations/`
            await axios.delete(endpoint + vacation.id);
            this.state.socket.emit("delete-vacation", vacation)
        }
        catch (e) {
            console.log(e)
        }
    }



    private logout = () => {
        LoginUtils.deleteUserCache()
        store.dispatch({ type: ActionType.updateIsUserLoggedIn })
        this.state.socket.disconnect()
        this.props.history.push("/home")

    }



    private onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
        let description = e.currentTarget.value
        if (description.length > 40) {
            alert("description must contain at most 40 digits")
            return
        }
        this.setState({ description })
        console.log(description)
    }

    private onChangeDestination = (e: ChangeEvent<HTMLInputElement>) => {
        let destination = e.currentTarget.value
        if (destination.length > 20) {
            alert("destination must contain at most 20 digits")
            return
        }
        this.setState({ destination })
        console.log(destination)
    }

    private onChangeDepartureDate = (e: ChangeEvent<HTMLInputElement>) => {
        let departureDate = e.currentTarget.value
        this.setState({ departureDate })
        console.log(departureDate)
    }

    private onChangeReturnDate = (e: ChangeEvent<HTMLInputElement>) => {
        let returnDate = e.currentTarget.value
        this.setState({ returnDate })
        console.log(returnDate)
    }

    private onChangePrice = (e: ChangeEvent<HTMLInputElement>) => {

        let price = parseInt(e.currentTarget.value)
        if (price > 9999) {
            alert("price cannot reach values over 9999")
            return
        }
        this.setState({ price })
        console.log(price)

    }

    private onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {

        console.log(e.target.files[0])
        this.setState({ selectedFile: e.target.files[0] })
    }

    render() {
        return (



            <div className="adminPage">

                <div className="adminHeader">
                    <h3>Welcome {localStorage.getItem("LOCAL_STORAGE_FIRST_NAME")}</h3>
                    <div className="headerButtons">
                        <i className="fas fa-chart-bar cruiser fa-2x" onClick={() => { this.props.history.push("/chart") }}></i>
                        <button className="admin-logout" onClick={this.logout}>logout</button>
                        <button className="createVacation" onClick={this.handleCreatorModal}>Create vacation</button>
                        <h3> vacations menu: </h3>
                    </div>
                </div>
                <div className="admin-vacations">
                    <br></br> <br></br>
                    <br></br><br></br>

                    <Modal show={this.state.showModal} onHide={() => this.handleModal()} >
                        <Modal.Header closeButton> <h4>Vacation Handler</h4></Modal.Header>
                        <Modal.Body>
                            vacation description: <input className="description" value={this.state.description} onChange={e => this.onChangeDescription(e)}></input><br></br>
                            vacation destination: <input className="destination" value={this.state.destination} onChange={e => this.onChangeDestination(e)}></input><br></br>
                            image: <input className="image" value={this.state.imageUrl} onChange={e => this.onChangeImage(e)}></input><br></br>
                            departure date: <input type="date" className="departure" value={this.state.departureDate} onChange={e => this.onChangeDepartureDate(e)}></input><br></br>
                            return date: <input type="date" className="return" value={this.state.returnDate} onChange={e => this.onChangeReturnDate(e)}></input><br></br>
                            price: <input className="price" value={this.state.price} onChange={e => this.onChangePrice(e)}></input><br></br>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="modalButton">
                                <Button onClick={this.updateVacation}>Update Vacation</Button>
                            </div>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.creatorModal} onHide={() => this.handleCreatorModal()} >
                        <Modal.Header closeButton> <h4>Vacation Creator</h4></Modal.Header>
                        <Modal.Body>
                            vacation description: <input className="description" onChange={e => this.onChangeDescription(e)}></input><br></br>
                            vacation destination: <input className="destination" onChange={e => this.onChangeDestination(e)}></input><br></br>
                            image: <input className="image" type="file" onChange={e => this.onChangeImage(e)}></input><br></br>
                            departure date: <input type="DateTime-local" className="departure" onChange={e => this.onChangeDepartureDate(e)}></input><br></br>
                            return date: <input type="DateTime-local" className="return" onChange={e => this.onChangeReturnDate(e)}></input><br></br>
                            price: <input className="price" onChange={e => this.onChangePrice(e)}></input><br></br>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="modalButton">
                                <Button onClick={this.createVacation}>Add vacation</Button>
                            </div>
                        </Modal.Footer>
                    </Modal>




                    <div className="adminVacationList">
                        {this.state.vacations.map(vacation => (


                            <Card key={vacation.id} style={{ width: '18rem' }}>
                                <Card.Img className="vacation_image" variant="top" src={`/assets/images/${vacation.imageUrl}`} alt={vacation.imageUrl} />
                                <Card.Body>
                                    <div className="fontAwesome">
                                        <i className="fas fa-pencil-alt cruiser" onClick={() => this.onUpdateVacationClicked(vacation)}></i>
                                        <i className="far fa-trash-alt cruiser" onClick={() => this.onDeleteVacationClicked(vacation)}></i>
                                    </div>
                                    <Card.Title>{vacation.destination}</Card.Title>

                                    <Card.Text>
                                        {vacation.description}
                                    </Card.Text>
                                    <Card.Text>
                                        departure date: {vacation.departureDate} - return date: {vacation.returnDate}
                                    </Card.Text>
                                    <Card.Text>
                                        {vacation.price}
                                    </Card.Text>
                                </Card.Body>
                            </Card>


                        ))}
                    </div>

                </div>

            </div>

        )
    }
}