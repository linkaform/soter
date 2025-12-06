import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
  } from "../ui/dialog";
  
  import SearchInput from "../search-input";
  import { Dispatch, SetStateAction, useEffect, useState } from "react";
  import Image from "next/image";
  import { Contacto } from "@/lib/get-user-contacts";
  import { useGetUserContacts } from "@/hooks/useGetUserContacts";
  import { Button } from "../ui/button";
  
  interface ContactsModalProps {
	title: string;
	setSelected: Dispatch<SetStateAction<Contacto | null>>;
	isOpenModal: boolean;
	setOpenModal: Dispatch<SetStateAction<boolean>>;
  }
  
  export const MisContactosModal: React.FC<ContactsModalProps> = ({
	title,
	setSelected,
	isOpenModal,
	setOpenModal,
  }) => {
  
	const [searchText, setSearchText] = useState("");
  
	const { data: contacts, isLoading } = useGetUserContacts(isOpenModal);
  
	useEffect(() => {
	  if (isOpenModal) {
	  } else {
		const t = setTimeout(() => setSearchText(""), 300);
		return () => clearTimeout(t);
	  }
	}, [isOpenModal]);
  
	const filteredContacts = contacts?.filter((item: Contacto) =>
	  item.nombre?.toLowerCase().includes(searchText.toLowerCase())
	);
  
	const handleSelect = (contact: Contacto) => {
	  setSelected(contact);
	  setOpenModal(false);
	};
  
	return (
	  <Dialog open={isOpenModal} onOpenChange={setOpenModal}>
		<DialogContent forceMount className="max-w-xl flex flex-col">
		  <DialogHeader>
			<DialogTitle className="text-2xl text-center font-bold my-5">
			  {title}
			</DialogTitle>
		  </DialogHeader>
  
		  {isLoading ? (
			<div className="flex flex-col justify-center items-center min-h-[50vh]">
				<div className="mb-3 font-semibold text-gray-500">
				Canrgando información...
				</div>
			  <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
			</div>
		  ) : (
			<>
			  <SearchInput
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			  />
  
			  <div className="flex-1 overflow-y-auto max-h-[500px] border-t border-b mt-2">
  
				{filteredContacts?.length === 0 ? (
				  <div className="text-center text-lg text-gray-500 py-10">
					No hay resultados
				  </div>
				) : (
				  filteredContacts?.map((item: Contacto) => {
					const avatar = item?.fotografia?.[0]?.file_url || "/nouser.svg";
  
					return (
					  <div
					  	key={Math.random()}
						className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-100 cursor-pointer"
						onClick={() => handleSelect(item)}
					  >
						<div className="flex items-center space-x-4">
						  <div className="relative w-14 h-14 rounded-full overflow-hidden">
							<Image
							  src={avatar}
							  alt={item.nombre||""}
							  fill
							  sizes="56px"
							  className="object-cover"
							/>
						  </div>
  
						  <p className="font-semibold">{item.nombre}</p>
						</div>
					  </div>
					);
				  })
				)}
  
			  </div>
			</>
		  )}
  
		  <Button
			className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 mt-4"
			onClick={() => setOpenModal(false)}
		  >
			Cerrar
		  </Button>
		</DialogContent>
	  </Dialog>
	);
  };
  