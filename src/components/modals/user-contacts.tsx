import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../ui/dialog";
  
  import SearchInput from '../search-input';
import { ContactsTable } from "../table/contactos/table";
import { Dispatch, SetStateAction } from "react";
import { Contacto } from "@/lib/get-user-contacts";
  

  interface ContactsModalProps {
    title: string;
    children: React.ReactNode;
    closeModal: () => void;
    setSelected: Dispatch<SetStateAction<Contacto |null >>;
    isOpenModal:boolean
  }
  
  export const MisContactosModal: React.FC<ContactsModalProps> = ({
    title,
    children,
    setSelected,  // Recibimos la prop 'data'
    closeModal,
    isOpenModal
  }) => {
  
    return (
      <Dialog open={isOpenModal} onClose={closeModal}>
    <DialogTrigger asChild>{children}</DialogTrigger>
  
    <DialogContent className="max-w-xl flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-2xl text-center font-bold my-5">
          {title}
        </DialogTitle>
      </DialogHeader>
  
      {/* <SearchInput /> */}
  
        <div className="">
            <ContactsTable setSelected={setSelected}/>
        </div>
     
    </DialogContent>
  </Dialog>
  
    );
  };
  