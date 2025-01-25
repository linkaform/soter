
export const getBooths = async () => {
    const payload = {
      script_name: "script_turnos.py",
      option: "get_user_booths",   
    };
  
    const userJwt = localStorage.getItem("access_token"); 
  
      const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userJwt}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json(); 
      return data 
     
  
  };

