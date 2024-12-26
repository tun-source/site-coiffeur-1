window.onload = function () {
  // Fonction pour initialiser la carte avec Leaflet.js
  function initMap() {
      const salonLocation = [48.8588443, 2.2943506]; // Exemple : Tour Eiffel

      const map = L.map('map').setView(salonLocation, 15); // Niveau de zoom à 15

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker(salonLocation).addTo(map)
          .bindPopup('<b>Ardy Coiff Hair</b><br>Salon de coiffure')
          .openPopup();
  }

  initMap();
}

// URL de l'API Sheet.best
const apiUrl = "https://api.sheetbest.com/sheets/3fc64431-a05b-4d61-9504-2afeba9d4fac";

// Fonction pour récupérer les données depuis Google Sheet
async function fetchData() {
  try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Erreur réseau : ' + response.status);
      const data = await response.json();

      console.log('Données brutes récupérées :', data);

      // Nettoyer les données
      const cleanedData = data.map(item => ({
          Catégorie: item.Catégorie?.trim(),
          Clé: item.Clé?.trim(),
          Valeur: item.Valeur?.trim()
      }));

      console.log('Données nettoyées :', cleanedData);

      // Mettre à jour les différentes sections du site
      const videoData = cleanedData.find(item => item.Catégorie === "BannièreVidéo" && item.Clé === "URL");
      if (videoData) {
          updateBannerVideo(videoData.Valeur);
      }

      const services = cleanedData.filter(item => item.Catégorie === "Services");
      displayServices(services);

      const contactInfo = cleanedData.filter(item => item.Catégorie === "NousContacter");
      displayContactInfo(contactInfo);

  } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
  }
}

// Fonction pour mettre à jour la vidéo de la bannière
function updateBannerVideo(videoUrl) {
  const bannerVideo = document.getElementById('banner-video');
  if (bannerVideo && videoUrl) {
      const sourceElement = bannerVideo.querySelector('source');
      if (sourceElement) {
          sourceElement.src = videoUrl;
          bannerVideo.load(); // Recharge la vidéo pour appliquer la mise à jour
          console.log('Vidéo mise à jour avec le lien :', videoUrl);
      }
  } else {
      console.warn('Élément vidéo ou URL manquante.');
  }
}

// Fonction pour afficher les services
function displayServices(services) {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = ''; // Réinitialiser la liste
    services.forEach(service => {
      const listItem = document.createElement('li');
      listItem.classList.add('animate-fade-in'); // Ajoute l'animation
      const icon = '<i class="fas fa-cut"></i>'; // Exemple d'icône (modifie selon tes besoins)
      listItem.innerHTML = `${icon} <strong>${service.Clé}</strong>: ${service.Valeur}`;
      servicesList.appendChild(listItem);
    });
  }
  

// Fonction pour afficher les informations de contact
function displayContactInfo(contacts) {
  const contactInfo = document.getElementById('contact-info');
  contactInfo.innerHTML = ''; // Réinitialiser les informations de contact
  contacts.forEach(contact => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${contact.Clé}:</strong> ${contact.Valeur}`;
      contactInfo.appendChild(listItem);
  });
}

// Fonction pour faire défiler les images à gauche
function scrollLeft() {
  const carousel = document.querySelector('.image-carousel');
  carousel.scrollBy({
      left: -300, // Ajuste la distance du défilement
      behavior: 'smooth'
  });
}

// Fonction pour faire défiler les images à droite
function scrollRight() {
  const carousel = document.querySelector('.image-carousel');
  carousel.scrollBy({
      left: 300, // Ajuste la distance du défilement
      behavior: 'smooth'
  });
}

// Ajout des événements pour les flèches
document.querySelector('.left-arrow').addEventListener('click', scrollLeft);
document.querySelector('.right-arrow').addEventListener('click', scrollRight);

// Ajout d'une fonction qui écoute le scroll pour changer la taille du header
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) { // Si l'utilisateur a défilé de plus de 50px
        header.classList.add('shrink'); // Réduit la taille de la bannière
    } else {
        header.classList.remove('shrink'); // Restaure la taille initiale
    }
});

// Vérifie les mises à jour toutes les 10 secondes
setInterval(fetchData, 10000);

// Appel initial pour charger les données lors du chargement de la page
fetchData();
