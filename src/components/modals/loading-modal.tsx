import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface LoadingModalProps {
  text: string;
  isOpen:boolean;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  text,
  isOpen,
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="flex flex-col items-center p-6 bg-white rounded-xl max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center">{text}</DialogTitle>
      </DialogHeader>
      <div className="w-20 h-20 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin mt-2"></div>
      </DialogContent>
    </Dialog>
  );
};
