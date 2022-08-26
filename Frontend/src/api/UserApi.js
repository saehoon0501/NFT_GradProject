import axios from 'axios'



const userApi = axios.create({
    baseURL:'http://localhost:4000/api/user',   
})
// headers:{
//     Authorization: `Bearer ${token}`,
// }
userApi.interceptors.request.use((config)=>{
    const token = window.localStorage.getItem("NFTLogin");
    if(!token){        
        return config
    }
    config.headers = { 
        'Authorization': `Bearer ${token}`,        
      }
    return config
})

export const getUser = async (signal) =>{
    const response = await userApi.get('',{
        signal
    })
    return response.data
}

export const updateUser = async (caption, profileName) => {
    const response = await userApi.patch('',{
        caption,
        profileName
    })
    return response
}

export const updateProfilePic = async (profile_pic) => {
    const response = await userApi.patch('',{
        profile_pic
    })
    return response
}