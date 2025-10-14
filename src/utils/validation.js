// Système de validation pour les formulaires
export const validationRules = {
    // Validation pour l'inscription
    inscription: {
        nom: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
            message: 'Le nom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres'
        },
        prenom: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
            message: 'Le prénom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Veuillez entrer une adresse email valide'
        },
        telephone: {
            required: true,
            pattern: /^(0[1-9]|[1-9])[0-9]{8}$/,
            message: 'Veuillez entrer un numéro de téléphone ivoirien valide (ex: 0712345678)'
        },
        motDePasse: {
            required: true,
            minLength: 6,
            maxLength: 100,
            message: 'Le mot de passe doit contenir au moins 6 caractères'
        },
        confirmMotDePasse: {
            required: true,
            message: 'Veuillez confirmer votre mot de passe'
        },
        // Validation spécifique aux prestataires
        specialite: {
            required: true,
            message: 'Veuillez sélectionner une spécialité'
        },
        quartier: {
            required: true,
            minLength: 2,
            maxLength: 100,
            message: 'Veuillez entrer votre quartier'
        },
        joursDisponibles: {
            required: true,
            minLength: 1,
            message: 'Veuillez sélectionner au moins un jour disponible'
        }
    },

    // Validation pour la connexion
    connexion: {
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Veuillez entrer une adresse email valide'
        },
        motDePasse: {
            required: true,
            minLength: 1,
            message: 'Veuillez entrer votre mot de passe'
        }
    }
};

// Fonction de validation générique
export const validateField = (value, rules) => {
    if (!rules) return { isValid: true };

    // Vérifier si le champ est requis
    if (rules.required && (!value || value.toString().trim() === '')) {
        return { isValid: false, message: rules.message || 'Ce champ est obligatoire' };
    }

    // Si le champ n'est pas requis et est vide, il est valide
    if (!rules.required && (!value || value.toString().trim() === '')) {
        return { isValid: true };
    }

    // Vérifier la longueur minimale
    if (rules.minLength && value.toString().length < rules.minLength) {
        return { isValid: false, message: rules.message || `Minimum ${rules.minLength} caractères requis` };
    }

    // Vérifier la longueur maximale
    if (rules.maxLength && value.toString().length > rules.maxLength) {
        return { isValid: false, message: rules.message || `Maximum ${rules.maxLength} caractères autorisés` };
    }

    // Vérifier le pattern (regex)
    if (rules.pattern && !rules.pattern.test(value.toString())) {
        return { isValid: false, message: rules.message || 'Format invalide' };
    }

    return { isValid: true };
};

// Fonction pour valider un objet complet
export const validateForm = (data, formType) => {
    const rules = validationRules[formType];
    if (!rules) return { isValid: true, errors: {} };

    const errors = {};
    let isValid = true;

    // Valider chaque champ
    Object.keys(rules).forEach(fieldName => {
        const fieldRules = rules[fieldName];
        const fieldValue = data[fieldName];
        
        const validation = validateField(fieldValue, fieldRules);
        
        if (!validation.isValid) {
            errors[fieldName] = validation.message;
            isValid = false;
        }
    });

    // Validation spéciale pour la confirmation du mot de passe
    if (formType === 'inscription' && data.motDePasse && data.confirmMotDePasse) {
        if (data.motDePasse !== data.confirmMotDePasse) {
            errors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
            isValid = false;
        }
    }

    return { isValid, errors };
};

// Fonction pour valider les données spécifiques aux prestataires
export const validatePrestataireData = (data) => {
    const errors = {};
    let isValid = true;

    // Vérifier que les champs obligatoires sont remplis
    if (!data.specialite) {
        errors.specialite = 'Veuillez sélectionner une spécialité';
        isValid = false;
    }

    if (!data.quartier || data.quartier.trim() === '') {
        errors.quartier = 'Veuillez entrer votre quartier';
        isValid = false;
    }

    if (!data.joursDisponibles || data.joursDisponibles.length === 0) {
        errors.joursDisponibles = 'Veuillez sélectionner au moins un jour disponible';
        isValid = false;
    }

    // Vérifier la cohérence des horaires
    if (!data.disponibilite24h && data.heureOuverture && data.heureFermeture) {
        const heureOuverture = new Date(`2000-01-01T${data.heureOuverture}`);
        const heureFermeture = new Date(`2000-01-01T${data.heureFermeture}`);
        
        if (heureOuverture >= heureFermeture) {
            errors.heureFermeture = 'L\'heure de fermeture doit être après l\'heure d\'ouverture';
            isValid = false;
        }
    }

    return { isValid, errors };
};

// Hook personnalisé pour la validation en temps réel
export const useValidation = (formType) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (fieldName, value) => {
        const rules = validationRules[formType];
        if (!rules || !rules[fieldName]) return;

        const validation = validateField(value, rules[fieldName]);
        
        setErrors(prev => ({
            ...prev,
            [fieldName]: validation.isValid ? null : validation.message
        }));
    };

    const handleBlur = (fieldName, value) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        validateField(fieldName, value);
    };

    const validateForm = (data) => {
        const result = validateForm(data, formType);
        setErrors(result.errors);
        return result;
    };

    const hasError = (fieldName) => {
        return touched[fieldName] && errors[fieldName];
    };

    const getError = (fieldName) => {
        return hasError(fieldName) ? errors[fieldName] : null;
    };

    return {
        errors,
        touched,
        validateField,
        handleBlur,
        validateForm,
        hasError,
        getError
    };
};

export default {
    validationRules,
    validateField,
    validateForm,
    validatePrestataireData,
    useValidation
};
