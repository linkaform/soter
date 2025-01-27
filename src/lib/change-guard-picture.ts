

export const uploadProfilePicture = async (file: File) => {
    const userJwt = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");
  
    // Primera petición: `POST` para subir la imagen
    const uploadResponse = await fetch(
      `https://app.linkaform.com/api/infosync/user_admin/${userId}/profile_picture/`,
      {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("name", "profile_picture");
          formData.append("profile_picture", file);
          return formData;
        })(),
        headers: {
          Authorization: `Bearer ${userJwt}`,
        },
      }
    );
  
    const uploadResult = await uploadResponse.json();
  
    // Verifica si el servidor devolvió un `thumb`
    if (!uploadResult.thumb) {
      console.error("No se encontró el thumb en la respuesta del servidor.");
      return { success: false, message: "No se pudo obtener el thumb." };
    }
  
    // Segunda petición: `PATCH` para actualizar la URL del `thumb` en el perfil del usuario
    const updateResponse = await fetch(
      `https://app.linkaform.com/api/infosync/user_admin/${userId}/`,
      {
        method: "PATCH",
        body: JSON.stringify({ thumb: uploadResult.thumb }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userJwt}`,
        },
      }
    );
  
    if (!updateResponse.ok) {
      console.error("Error al actualizar el perfil del usuario.");
      return { success: false, message: "Error al actualizar el perfil." };
    }
  
    const updateResult = await updateResponse.json();
    return { success: true, data: updateResult };
  };
  