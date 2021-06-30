import React, { ChangeEvent, Component } from 'react'
import Vacation from '../../models/vacation'
import IsFollowing from '../../models/isFollowing'
import { API_ENDPOINT } from '../../config/constants'
import axios from 'axios'
import LoginUtils from '../../utils/LoginUtils'
import VacationUtils from '../../utils/VacationUtils'
import "./Client.css"
import { store }from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import { Unsubscribe } from 'redux'

interface ClientState {
    socket : any,
    vacations: Vacation[],
}


export default class Client extends Component<any, ClientState>{

    private unsubscribe : Unsubscribe

    constructor(props: any) {
        super(props)
    


    this.state = {
        socket: store.getState().socket,
        vacations: [],
    }
   
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() =>
        this.setState({socket: store.getState().socket})
        )
        this.initPage()
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    private initPage = async () => {
    try{

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
    catch(err){
        console.log(err)
    }
    }

    

    private registerSocketListeners = () => {
        this.state.socket.on("add-new-vacation", (newVacation : Vacation) => {
            newVacation.departureDate = VacationUtils.fixDateFormat(newVacation.departureDate)
            newVacation.returnDate = VacationUtils.fixDateFormat(newVacation.returnDate)
            let newState = {...this.state}
            newState.vacations.push(newVacation)
            this.setState(newState)
        }) 
        this.state.socket.on("update-vacation", (vacation: Vacation) => {

            vacation.departureDate = VacationUtils.fixDateFormat(vacation.departureDate)
            vacation.returnDate =  VacationUtils.fixDateFormat(vacation.returnDate)
            let newState = { ...this.state }
            let index = VacationUtils.getVacationIndex(newState, vacation)
            newState.vacations[index] = vacation
            this.setState(newState)
            
        })
        this.state.socket.on("delete-vacation", (vacation: Vacation) => {
            console.log("trying to delete the vacation")
         let newState = { ...this.state }
         let index = VacationUtils.getVacationIndex(newState, vacation)
         newState.vacations.splice(index, 1)
         this.setState(newState)
        })
     }

    
    private handleFollowing = async (vacation: Vacation) => {

        LoginUtils.setTokenToHeader()
        
        let vacationId = vacation.id
        console.log(vacation.isFollowed)
        if (vacation.isFollowed) {

         
            await axios.delete(`${API_ENDPOINT}/following/${vacationId}`)
            console.log("delete following")
            this.state.socket.emit("unfollow-vacation", vacation)
        }
        else {

            await axios.post(`${API_ENDPOINT}/following/${vacationId}`)
            console.log("follow vacation")
            this.state.socket.emit("follow-vacation", vacation)

        }
        vacation.isFollowed = !vacation.isFollowed
        this.setState({ vacations: this.state.vacations })
     

      




    }
  


    private logout = () => {
    LoginUtils.deleteUserCache()
    store.dispatch({type: ActionType.updateIsUserLoggedIn})
    this.state.socket.disconnect()
    this.props.history.push("/home")
    }






    render() {

        return (
         
      
           
            <div className="clientContainer">
                <div className="clientHeader">
                 <h3> Welcome {localStorage.getItem("LOCAL_STORAGE_FIRST_NAME")}</h3>
                 <div className="logoutContainer">
               <button className="logout" onClick={this.logout}>logout</button>
                </div>
                 </div>
            <div className="vacationList">
              
               
                <div className="vacationsBlock">

                {this.state.vacations.map(vacation => (


                    <div key={vacation.id} className="vacation">

                        <h2 className="vacation_destination">{vacation.destination}</h2>
                        <img src={`/assets/images/${vacation.imageUrl}`} alt={vacation.imageUrl} className="vacation_image" />
                        <div className="vacation_description">{vacation.description}</div>
                        <h3 className="vacation_price">{vacation.price}</h3>
                        <div className="departureDate">departure date: {vacation.departureDate}</div>
                        <div className="returnDate">return date: {vacation.returnDate}</div>
                        <input type="checkbox" checked={vacation.isFollowed} onChange={() => this.handleFollowing(vacation)} />


                    </div>

                ))}
            </div>
            </div>
            </div>
            
         
            
        )
    }
}
// ASCII HURT
{/* &#9829; */}