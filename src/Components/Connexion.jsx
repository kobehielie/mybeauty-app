// Importer les outils React nécessaires
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import { validateForm } from '../utils/validation';
import Admin from '../models/Admin';

const Connexion = () => {
    const [emailSaisi, setEmailSaisi] = useState('');
    const [motDePasseSaisi, setMotDePasseSaisi] = useState('');
    const [messageAffiche, setMessageAffiche] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login, loading, user } = useAuth();

    // Rediriger si l'utilisateur est déjà connecté
    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/dashboard-admin');
            } else if (user.role === 'client') {
                navigate('/dashboard-client');
            } else if (user.role === 'prestataire') {
                navigate('/dashboard-prestataire');
            }
        }
    }, [user, navigate]);

    const seConnecter = async (e) => {
        e.preventDefault();

        // Réinitialiser les erreurs
        setErrors({});
        setMessageAffiche('');

        // Validation du formulaire
        const formData = {
            email: emailSaisi,
            motDePasse: motDePasseSaisi
        };

        const validation = validateForm(formData, 'connexion');
        if (!validation.isValid) {
            setErrors(validation.errors);
            setMessageAffiche("❌ Veuillez corriger les erreurs dans le formulaire");
            return;
        }

        try {
            // Vérifier d'abord si c'est un admin
            if (emailSaisi === 'admin@admin.com') {
                const resultAdmin = Admin.seConnecter(emailSaisi, motDePasseSaisi);
                
                if (resultAdmin.success) {
                    setMessageAffiche(`✅ Bienvenue Admin !`);
                    setTimeout(() => {
                        navigate('/dashboard-admin');
                    }, 1000);
                    return;
                } else {
                    setMessageAffiche(`❌ ${resultAdmin.message}`);
                    return;
                }
            }

            // Sinon, tentative de connexion normale via le contexte d'authentification
            const result = await login(emailSaisi, motDePasseSaisi);
            
            if (result.success) {
                setMessageAffiche(`✅ Bienvenue ${result.user.prenom} ${result.user.nom} !`);
                
                // Redirection vers le dashboard approprié
                setTimeout(() => {
                    if (result.user.role === 'client') {
                        navigate('/dashboard-client');
                    } else {
                        navigate('/dashboard-prestataire');
                    }
                }, 1000);
            } else {
                setMessageAffiche(`❌ ${result.message}`);
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            setMessageAffiche("❌ Une erreur est survenue lors de la connexion. Veuillez réessayer.");
        }
    };

    const allerAInscription = () => {
        navigate('/inscription');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full mb-4">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                        Connexion
                    </h2>
                    <p className="text-gray-600 mt-2">Accédez à votre compte MyBeauty</p>
                </div>

                {messageAffiche && (
                    <div className={`p-4 mb-6 rounded-lg text-center font-medium ${
                        messageAffiche.includes('✅')
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {messageAffiche}
                    </div>
                )}

                <form onSubmit={seConnecter} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            📧 Email
                        </label>
                        <input
                            type="email"
                            value={emailSaisi}
                            onChange={(e) => setEmailSaisi(e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="votre.email@exemple.com"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            🔒 Mot de passe
                        </label>
                        <input
                            type="password"
                            value={motDePasseSaisi}
                            onChange={(e) => setMotDePasseSaisi(e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition ${
                                errors.motDePasse ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Votre mot de passe"
                            required
                        />
                        {errors.motDePasse && <p className="text-red-500 text-sm mt-1">{errors.motDePasse}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition shadow-lg hover:shadow-xl ${
                            loading 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                        }`}
                    >
                        {loading ? '⏳ Connexion en cours...' : '🚀 Se connecter'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Pas encore de compte ?{' '}
                        <button 
                            onClick={allerAInscription}
                            className="text-pink-600 font-semibold hover:underline"
                        >
                            S'inscrire
                        </button>
                    </p>
                </div>

                {/* Informations de test */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">🧪 Comptes de test</h3>
                    <div className="text-xs text-blue-700 space-y-1">
                        <p><strong>Client :</strong> jean.koffi@email.com / password123</p>
                        <p><strong>Prestataire :</strong> koffi.marie@email.com / salon123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Connexion;