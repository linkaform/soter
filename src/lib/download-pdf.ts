export const descargarPdfPase = async (url_pase:string) => {
    await fetch(url_pase)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el archivo');
            }
            return response.blob();  
        })
        .then(blob => {
            const url = URL.createObjectURL(blob); 
            const a = document.createElement('a');
            a.href = url;
            a.download = 'PASE_DE_ENTRADA.pdf'; 
            document.body.appendChild(a);
            a.click(); 

            document.body.removeChild(a);
            URL.revokeObjectURL(url); 
        })
        .catch(error => {
            console.error('Error al descargar el PDF:', error);
        });
}