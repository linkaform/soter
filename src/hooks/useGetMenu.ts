import { getMenu } from "@/lib/get-menu";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useMenuStore } from "@/store/useGetMenuStore";
import { useQuery } from "@tanstack/react-query";

export const useGetMenu = () => {
	const {
		menuItems,
		setLabels,
		labels,
		setMenuItems
	} = useMenuStore();
	
	const { isLoading:isLoadingMenu, error:errorMenu, refetch: refetfchMenu } = useQuery<any>({
	queryKey: ["getMenu"], 
	queryFn: async () => {
		const data = await getMenu(); 
		if (!data.response || !data.response?.data || !data.response?.data.menus) {
			return []
		}
		if(data.response?.data.menus){
			const dataRaw =data.response?.data.menus
			setLabels(dataRaw);
            const transformedData = dataRaw.map((item: string) => {
                let text = item;
                if (item === "incidencias") {
                    text = "Incidencias / Fallas";
                } else if (item === "articulos") {
                    text = "Artículos Perdidos / Concesionados";
                }
                else if (item === "pases") {
                    text = "Pases de entrada";
                }else{
                    text = capitalizeFirstLetter(item);
                }
                return {
                    id: item,
                    label: text,
                };
            })
            setMenuItems(transformedData)
        }
		
		return data.response?.data.menus||null;
	},
	refetchOnWindowFocus: false, 
	refetchInterval: false,
	refetchOnReconnect: false, 
	staleTime: Infinity, 
	});

  return {
    // Menu
    menuItems,
	labels,
    isLoadingMenu,
    errorMenu,
	refetfchMenu
  };
}