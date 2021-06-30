import axios from 'axios'

export default class LoginUtils  {
public static   setUserCache(authToken: string, firstName: string) {
    localStorage.setItem("LOCAL_STORAGE_AUTH_TOKEN", authToken)
    localStorage.setItem("LOCAL_STORAGE_FIRST_NAME", firstName)
}

public static getUserCacheAuthToken(){
   let token = localStorage.getItem("LOCAL_STORAGE_AUTH_TOKEN")
   return token

}

public static deleteUserCache() {
    localStorage.removeItem("LOCAL_STORAGE_AUTH_TOKEN")
    localStorage.removeItem("LOCAL_STORAGE_FIRST_NAME")
}

public static setTokenToHeader(){
let token = LoginUtils.getUserCacheAuthToken()
axios.defaults.headers.common["Authorization"] =
      "Bearer " + token
}



}
