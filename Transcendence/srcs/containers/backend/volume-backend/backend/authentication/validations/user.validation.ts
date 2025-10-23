export class AuthValidations
{
	static nickname(nickname)
	{
		if (!nickname || nickname.length < 3)
			throw new Error("El nickname debe tener al menos 3 caracteres.");
		if (!/^[a-zA-Z0-9_]+$/.test(nickname))
			throw new Error("El nickname solo puede contener letras, números y guiones bajos.");
	}	
	static password(password)
	{
		if (!password || password.length < 6)
			throw new Error("La contraseña debe tener al menos 6 caracteres.");
		if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
			throw new Error("La contraseña debe contener al menos una letra y un número.");
	}	
	static email(email)
	{
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
			throw new Error("El correo electrónico no es válido.");
	}
}