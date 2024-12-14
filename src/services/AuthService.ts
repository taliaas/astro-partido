export default class AuthService {

    async login(user: {
        email: string,
        password: string
    }) {
        try {
            const response = await fetch(`https://part-back.onrender.com/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const token = await response.json();
            //guardar el token
            //localStorage.setItem('access_token', data.access_token);
        } catch (error) {
            console.error('Error al autenticar al usuario', error);
        }
    }
    async register(email: string,
        name: string,
        password: string) {
        try {
            const response = await fetch(`https://part-back.onrender.com/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, password }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al registrar al usuario',error);
        }
    }

    async profile(){
        const value = 'access-token' //cargar el token de donde lo guarde (localStorage.getItem('access_token'))
        try {
            const response = await fetch(`https://part-back.onrender.com/verify`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${value}`
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al verificar al usuario',error);
        }
    }

    async updatePassword(id: number, prev_pw: string, new_pw: string ) {
        try {
            const response = await fetch(`https://part-back.onrender.com/auth/${id}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({prev_pw,new_pw}),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al actualizar la contraseña del usuario', error);
        }
    }

}