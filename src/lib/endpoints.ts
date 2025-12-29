const baseUrl = "https://app.linkaform.com/api/infosync/scripts/run/";

export const getAreasByLocations = async (locations: string[]) => {
    const userJwt = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userJwt}`,
        },
        body: JSON.stringify({
            script_name: "pase_de_acceso.py",
            option: "get_areas_by_locations",
            locations,
        }),
    });
    const data = await response.json();
    return data;
};