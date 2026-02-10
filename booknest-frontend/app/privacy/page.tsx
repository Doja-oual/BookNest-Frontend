import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de confidentialité - BookNest',
  description: 'Politique de confidentialité de la plateforme BookNest',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Politique de confidentialité
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Collecte des données
              </h2>
              <p className="text-gray-600 leading-relaxed">
                BookNest collecte les données personnelles suivantes lors de votre inscription :
                nom, prénom, adresse email, et numéro de téléphone. Ces informations sont
                nécessaires pour créer votre compte et gérer vos réservations d'événements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Utilisation des données
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Gérer votre compte utilisateur</li>
                <li>Traiter vos réservations d'événements</li>
                <li>Vous envoyer des notifications concernant vos réservations</li>
                <li>Améliorer nos services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Protection des données
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos
                données personnelles contre tout accès non autorisé, modification, divulgation
                ou destruction. Vos données sont stockées de manière sécurisée et ne sont
                accessibles qu'au personnel autorisé.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Partage des données
              </h2>
              <p className="text-gray-600 leading-relaxed">
                BookNest ne vend, ne loue ni ne partage vos données personnelles avec des tiers,
                sauf dans les cas suivants :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Avec votre consentement explicite</li>
                <li>Pour se conformer à des obligations légales</li>
                <li>Pour protéger nos droits et notre sécurité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Vos droits
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification de vos données</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Pour exercer ces droits, veuillez nous contacter à l'adresse :
                <a href="mailto:privacy@booknest.com" className="text-orange-600 hover:text-orange-700 ml-1">
                  privacy@booknest.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                BookNest utilise des cookies essentiels pour le fonctionnement du site,
                notamment pour maintenir votre session de connexion. Nous n'utilisons pas de
                cookies de tracking ou publicitaires.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Conservation des données
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Vos données personnelles sont conservées aussi longtemps que votre compte est
                actif. Si vous souhaitez supprimer votre compte, vos données seront supprimées
                dans un délai de 30 jours, sauf obligation légale de conservation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Modifications
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nous nous réservons le droit de modifier cette politique de confidentialité à
                tout moment. Les modifications seront publiées sur cette page avec la date de
                dernière mise à jour.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                <strong>Dernière mise à jour :</strong> 10 février 2026
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Contact
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant cette politique de confidentialité, vous pouvez
                nous contacter à :
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Email :</strong>{' '}
                  <a href="mailto:privacy@booknest.com" className="text-orange-600 hover:text-orange-700">
                    privacy@booknest.com
                  </a>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
