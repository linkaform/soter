interface Props {
    area?: string;
    location?: string;
    checkin_id?: string;
    support_guards: { user_id: number; name: string }[]; // Campo obligatorio
  }
  
  export const updateSupportGuards = async ({
    area = "Caseta Principal",
    location = "Planta Monterrey",
    checkin_id,
    support_guards,
  }: Props) => {
    const payload = {
      area,
      location,
      checkin_id,
      support_guards,
      option: "update_guards",
      script_name: "script_turnos.py",
    };
  
    const userJwt = localStorage.getItem("access_token");
  
    const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJwt}`,
      },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
    return data;
  };