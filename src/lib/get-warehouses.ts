

export const getCycleCounts = async () => {
    const payload = {
      script_name: "lot_count.py",
      option: "get_cycle_counts",
    };
  

    const userJwt = localStorage.getItem("access_token"); 

  
    const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJwt}`,
      },
      body: JSON.stringify(payload),
    });
  
  
    const data = await response.json();
    return data;
  };