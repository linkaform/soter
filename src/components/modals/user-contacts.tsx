import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger, 
	} from "../ui/dialog";
	
import { ContactsTable } from "../table/contactos/table";
import { Dispatch, SetStateAction } from "react";
import { Contacto } from "@/lib/get-user-contacts";
import { Button } from "../ui/button";
	
interface ContactsModalProps {
	title: string;
	closeModal: () => void;
	setSelected: Dispatch<SetStateAction<Contacto |null >>;
	isOpenModal:boolean
}

export const MisContactosModal: React.FC<ContactsModalProps> = ({
	title,
	setSelected, 
	closeModal,
	isOpenModal
}) => {
	
return (
	<Dialog open={isOpenModal} >
		<DialogTrigger ></DialogTrigger>
		<DialogContent className="max-w-xl flex flex-col">
			<DialogHeader>
				<DialogTitle className="text-2xl text-center font-bold my-5">
					{title}
				</DialogTitle>
			</DialogHeader>
				<div className="">
					<ContactsTable setSelected={setSelected}/>
				</div>
			<Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={closeModal}>
			Cerrar
		</Button>
		</DialogContent>
	</Dialog>
	);
};
