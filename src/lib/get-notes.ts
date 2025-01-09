
export const getNotes = async (area: string, location: string) => {
    const payload = {
      script_name: "notes.py",
      option: "get_notes",
      area,
      location,
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



