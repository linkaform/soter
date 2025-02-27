export const getStats = async (
    location:string, area:string,page:string) => {
    const payload = {
        area,
        location,
        page,
        option: "get_stats",
        script_name: "get_stats.py",
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
  