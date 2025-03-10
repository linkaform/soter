export const getGafetes = async (
    location:string, area:string, status:string) => {
    const payload = {
        location,
        area: area,
        status: status,
        option: "get_gafetes",
        script_name: "gafetes_lockers.py",
    };
  
    const userJwt = localStorage.getItem("access_token"); 
  
    const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userJwt}`,
        },
        body: JSON.stringify(payload),
    });
  
    const data = await response.json();
    return data;
  };
  