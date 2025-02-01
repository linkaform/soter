  export const uploadImage = async (img: File|null) => {
    const formData = new FormData();
        formData.append('File', img);
        formData.append('field_id', '660459dde2b2d414bce9cf8f');
        formData.append('is_image', true);
        formData.append('form_id', 116852);
        
        const response = await fetch('https://app.linkaform.com/api/infosync/cloud_upload/', {
            method: "POST",
            body:formData,
        });
      
        const data = await response.json();
        return data;
  };
