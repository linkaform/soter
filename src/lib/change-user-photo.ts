import { toast } from "sonner";

export const changeUserPhoto = async (userId:number, file:File) => {            
    const urlChangeImage= `https://app.linkaform.com/api/infosync/user_admin/${userId}/profile_picture/`
    const formData = new FormData();
    formData.append('name', 'profile_picture');
    formData.append('profile_picture', file);
    
    const userJwt = localStorage.getItem("access_token");
    const response= await fetch(urlChangeImage, {
        method: 'POST',
        body: formData,
        headers:
        {
            'Authorization': 'Bearer '+userJwt
        },
    })       
  
    const data = await response.json();
    return data;
};
  
export const changeUserPhotoPatch = async (userId:number, thumb:number) => {     
    const jwt = localStorage.getItem("access_token"); 
    const body={
        method:'PATCH',
        body: JSON.stringify({
            thumb: thumb
        }),
        headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+ jwt },
    }     
    const responseData=  await fetch(`https://app.linkaform.com/api/` + `infosync/user_admin/${userId}/`, body)
    if(responseData.status == 200 || responseData.status == 202 || responseData.status == 201){
        return true
    }else{
        toast.error("Ocurrio un error, intentalo de nuevo mas tarde.")
        return false
    }
};
