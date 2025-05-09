import {create} from "zustand";

interface PdfStore {
    pdfId: string | null;
    pdfData: any | null;
    setPdf: (id: string, data: any) => void;
    clearPdf: () => void;
  }
  
  export const usePdfStore = create<PdfStore>((set) => ({
    pdfId: null,
    pdfData: null,
    setPdf: (id, data) => set({ pdfId: id, pdfData: data }),
    clearPdf: () => set({ pdfId: null, pdfData: null }),
  }));