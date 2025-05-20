
interface GetMyPasesParams {
    tab?: string;
  }
  
  export const getMyPases = async ({
    tab = "Todos",
  }: GetMyPasesParams = {}) => {
    const payload = {
        tab_status: tab,
        option: "get_my_pases",
        script_name: "pase_de_acceso.py",
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
  