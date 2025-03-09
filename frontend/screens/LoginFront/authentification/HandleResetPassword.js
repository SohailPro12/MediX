import axios from 'axios';

const resetPasswordHandler = async (token, newPassword, retypePassword, setMessage, navigation) => {
  if (newPassword !== retypePassword) {
    setMessage('Les mots de passe ne correspondent pas.');
    return;
  }

  try {
    const response = await axios.post('https://293f-41-250-106-197.ngrok-free.app/api/auth/reset-password', {
      token,
      newPassword,
    });

    setMessage(response.data.message);
    navigation.navigate('LoginScreen');  // Naviguer vers la page de connexion après réinitialisation
  } catch (error) {
    setMessage('Erreur lors de la réinitialisation du mot de passe');
  }
};

export default resetPasswordHandler;
