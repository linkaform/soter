
export const getEntryPasses = async (tabStatus='Todos') => {
    const payload = {
      script_name: "pase_de_acceso.py",
      option: "get_my_pases",
    tab_status:tabStatus   
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
