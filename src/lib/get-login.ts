export interface LoginResponse {
    error: string;
    code: number;
    jwt: string;
    session_id: string;
    success: boolean;
    user: {
      api_key: string;
      birt_authid: string;
      company_logo: {
        picture: string;
        thumbnail: string;
      };
      created_at: string;
      created_by: string | null;
      date_joined: number;
      deleted_at: string | null;
      domain_linked: string | null;
      email: string;
      first_name: string;
      groups: number[];
      id: number;
      is_active: boolean;
      is_online: boolean;
      lang: {
        code: string;
        lang: string;
      };
      last_login: number;
      last_logout: number;
      license_expired: boolean;
      name: string;
      parent: string;
      parent_info: {
        email: string;
        id: number;
        name: string;
      };
      permissions: string[];
      phone: string;
      position: string;
      profile_picture: string;
      resource_uri: string;
      thumb: string;
      timezone: string;
      updated_at: string;
      updated_by: string;
      username: string;
    };
  }

export const getLogin = async (email: string, password: string): Promise<LoginResponse> => {

      const response = await fetch('https://app.linkaform.com/api/infosync/user_admin/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: email,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });       
  

    const res = await response.json();

    return res
  };


