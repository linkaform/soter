
interface GetMyPasesParams {
    tab?: string;
    limit?: number;
    skip?: number;
    searchName?: string;
  }
  
  export const getMyPases = async ({
    tab = "Todos",
    limit = 10,
    skip = 0,
    searchName = ""
  }: GetMyPasesParams = {}) => {
    const payload = {
        tab_status: tab,
        limit,
        skip,
        search_name: searchName,
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
  