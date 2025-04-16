import * as WebBrowser from 'expo-web-browser';

const openPdf = async (uri) => {
  try {
    await WebBrowser.openBrowserAsync(uri);
  } catch (error) {
    console.log("Erreur lors de l'ouverture du PDF :", error);
  }
};

export default openPdf;