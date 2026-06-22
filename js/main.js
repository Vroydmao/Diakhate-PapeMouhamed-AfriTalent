/* ============================================
   AFRITALENT — main.js
   Auteur : [Ton Nom]
   Description : Fonctionnalités JavaScript
============================================ */

/* ============================================
   1. ANNÉE DYNAMIQUE — Footer copyright
============================================ */
// Récupère tous les éléments avec l'id "year" et insère l'année actuelle
document.querySelectorAll('#year').forEach(el => {
    el.textContent = new Date().getFullYear();
});

/* ============================================
   2. DARK MODE — Toggle + localStorage
============================================ */
// Récupère tous les boutons dark mode (un par page)
const darkModeToggles = document.querySelectorAll('#darkModeToggle');
const body = document.body;

// Fonction pour appliquer le thème
function applyTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        // Change l'icône en soleil quand dark mode est actif
        darkModeToggles.forEach(btn => {
            btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        });
    } else {
        body.classList.remove('dark-mode');
        // Change l'icône en lune quand light mode est actif
        darkModeToggles.forEach(btn => {
            btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
        });
    }
}

// Au chargement : vérifie si l'utilisateur avait choisi dark mode
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark');

// Au clic sur le bouton : bascule le thème et sauvegarde dans localStorage
darkModeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-mode');
        // Si dark mode actif → passe en light, sinon passe en dark
        applyTheme(!isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    });
});

/* ============================================
   3. NAVBAR — Changement de style au scroll
============================================ */
const navbar = document.getElementById('navbar');

// Écoute le défilement de la page
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        // Si l'utilisateur a scrollé plus de 50px : ajoute la classe "scrolled"
        navbar.classList.add('scrolled');
    } else {
        // Sinon : retire la classe "scrolled"
        navbar.classList.remove('scrolled');
    }
});

/* ============================================
   4. BOUTON RETOUR EN HAUT
============================================ */
const backToTopBtn = document.getElementById('backToTop');

// Affiche ou cache le bouton selon la position de scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        // Affiche le bouton en flex (pour centrer l'icône)
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

// Au clic : remonte en haut de la page en douceur
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ============================================
   5. COMPTEURS ANIMÉS — IntersectionObserver
============================================ */
// Sélectionne tous les éléments avec la classe "stat-number"
const counters = document.querySelectorAll('.stat-number');

// Fonction qui anime un compteur de 0 jusqu'à sa valeur cible
function animateCounter(el) {
    // Récupère la valeur cible depuis l'attribut data-target
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000; // Durée de l'animation en millisecondes
    const step = target / (duration / 16); // Calcule l'incrément par frame (60fps)
    let current = 0;

    // Fonction récursive qui s'appelle elle-même jusqu'à atteindre la cible
    function update() {
        current += step;
        if (current < target) {
            el.textContent = Math.floor(current).toLocaleString('fr-FR');
            requestAnimationFrame(update); // Continue l'animation
        } else {
            el.textContent = target.toLocaleString('fr-FR'); // Valeur finale exacte
        }
    }
    update();
}

// IntersectionObserver : déclenche l'animation quand l'élément est visible
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // L'élément est visible dans le viewport
            animateCounter(entry.target);
            // On arrête d'observer cet élément (animation jouée une seule fois)
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 }); // Se déclenche quand 50% de l'élément est visible

// Observe chaque compteur
counters.forEach(counter => counterObserver.observe(counter));

/* ============================================
   6. ANIMATIONS FADE-IN — IntersectionObserver
============================================ */
// Sélectionne tous les éléments avec la classe "fade-in"
const fadeElements = document.querySelectorAll('.fade-in');

// Observer qui ajoute la classe "visible" quand l'élément entre dans le viewport
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target); // Animation jouée une seule fois
        }
    });
}, { threshold: 0.1 }); // Se déclenche dès que 10% de l'élément est visible

// Observe chaque élément fade-in
fadeElements.forEach(el => fadeObserver.observe(el));

/* ============================================
   7. FILTRAGE DYNAMIQUE — Page Freelances
============================================ */
// Vérifie qu'on est sur la page freelances
const filterBtns = document.querySelectorAll('.filter-btn');
const freelanceItems = document.querySelectorAll('.freelance-item');
const noResults = document.getElementById('noResults');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            // 1. Met à jour l'état actif des boutons
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            // 2. Récupère le filtre sélectionné
            const filter = btn.getAttribute('data-filter');

            // 3. Affiche ou cache les cartes selon la catégorie
            let visibleCount = 0;
            freelanceItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'tous' || category === filter) {
                    // Affiche la carte
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    // Cache la carte
                    item.style.display = 'none';
                }
            });

            // 4. Affiche un message si aucun résultat
            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    });
}

/* ============================================
   8. VALIDATION FORMULAIRE — Page Contact
============================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {

    // Fonction qui vérifie un champ et affiche/cache l'erreur
    function validateField(fieldId, errorId, validationFn) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(errorId);

        if (!field || !errorDiv) return true;

        const errorMessage = validationFn(field.value.trim());

        if (errorMessage) {
            // Champ invalide : bordure rouge + message d'erreur
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            errorDiv.textContent = errorMessage;
            return false;
        } else {
            // Champ valide : bordure verte + efface l'erreur
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            errorDiv.textContent = '';
            return    true;
        }
    }

    // Règles de validation pour chaque champ
    const validations = {
        nom: (val) => {
            if (!val) return 'Le nom est obligatoire.';
            if (val.length < 2) return 'Le nom doit contenir au moins 2 caractères.';
            return null; // null = pas d'erreur
        },
        prenom: (val) => {
            if (!val) return 'Le prénom est obligatoire.';
            if (val.length < 2) return 'Le prénom doit contenir au moins 2 caractères.';
            return null;
        },
        email: (val) => {
            // Regex pour valider le format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!val) return 'L\'email est obligatoire.';
            if (!emailRegex.test(val)) return 'Veuillez entrer un email valide (ex: nom@email.com).';
            return null;
        },
        sujet: (val) => {
            if (!val) return 'Veuillez choisir un sujet.';
            return null;
        },
        message: (val) => {
            if (!val) return 'Le message est obligatoire.';
            if (val.length < 20) return `Message trop court (${val.length}/20 caractères minimum).`;
            return null;
        }
    };

    // Validation en temps réel : vérifie chaque champ quand l'utilisateur tape
    Object.keys(validations).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                validateField(fieldId, fieldId + 'Error', validations[fieldId]);
            });
        }
    });

    // Validation à la soumission du formulaire
    contactForm.addEventListener('submit', (e) => {
        // Empêche l'envoi réel du formulaire
        e.preventDefault();

        // Valide tous les champs et collecte les résultats
        const results = Object.keys(validations).map(fieldId => {
              return validateField(fieldId, fieldId + 'Error', validations[fieldId]);
        });

        // Vérifie si tous les champs sont valides
        const allValid = results.every(result => result === true);

        if (allValid) {
            // Formulaire valide : cache le formulaire et affiche le message de succès
            contactForm.style.display =    'none';
            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                successMsg.style.display = 'block';
                // Fait défiler jusqu'au message de succès
                successMsg.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}