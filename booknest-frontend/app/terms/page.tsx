import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions générales d\'utilisation - BookNest',
  description: 'Conditions générales d\'utilisation de la plateforme BookNest',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Conditions générales d'utilisation
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Objet
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir
                les modalités et conditions d'utilisation de la plateforme BookNest, ainsi que
                les droits et obligations des utilisateurs dans ce cadre.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Accès à la plateforme
              </h2>
              <p className="text-gray-600 leading-relaxed">
                L'accès à BookNest est gratuit. Pour réserver un événement, vous devez créer un
                compte en fournissant des informations exactes et à jour. Vous êtes responsable
                de la confidentialité de vos identifiants de connexion.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Conditions d'accès :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Être âgé d'au moins 18 ans</li>
                <li>Fournir des informations exactes lors de l'inscription</li>
                <li>Ne pas créer plusieurs comptes pour un même utilisateur</li>
                <li>Respecter les présentes CGU</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Services proposés
              </h2>
              <p className="text-gray-600 leading-relaxed">
                BookNest permet aux utilisateurs de :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Consulter la liste des événements disponibles</li>
                <li>Effectuer des réservations pour des événements</li>
                <li>Gérer leurs réservations (consultation, annulation)</li>
                <li>Télécharger des tickets pour les réservations confirmées</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Pour les administrateurs, la plateforme permet également de créer et gérer des
                événements, ainsi que de valider les réservations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Réservations
              </h2>
              <p className="text-gray-600 leading-relaxed">
                <strong>4.1 Processus de réservation :</strong>
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
                <li>Les réservations sont soumises à la disponibilité des places</li>
                <li>Une réservation est considérée comme en attente jusqu'à validation par l'administrateur</li>
                <li>Vous recevrez une notification par email lors de la confirmation de votre réservation</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                <strong>4.2 Annulation :</strong>
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Vous pouvez annuler une réservation en attente ou confirmée à tout moment</li>
                <li>L'annulation doit être effectuée au moins 24 heures avant l'événement</li>
                <li>Aucun remboursement n'est effectué pour les événements gratuits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Obligations de l'utilisateur
              </h2>
              <p className="text-gray-600 leading-relaxed">
                En utilisant BookNest, vous vous engagez à :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Fournir des informations exactes et à jour</li>
                <li>Ne pas usurper l'identité d'une autre personne</li>
                <li>Respecter les autres utilisateurs et le personnel</li>
                <li>Ne pas effectuer de réservations frauduleuses ou abusives</li>
                <li>Vous présenter à l'événement avec votre ticket en cas de réservation confirmée</li>
                <li>Respecter les règles spécifiques de chaque événement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Responsabilités
              </h2>
              <p className="text-gray-600 leading-relaxed">
                <strong>6.1 Responsabilité de BookNest :</strong>
              </p>
              <p className="text-gray-600 leading-relaxed ml-4">
                BookNest s'efforce d'assurer la disponibilité et le bon fonctionnement de la
                plateforme. Cependant, nous ne garantissons pas l'absence d'interruptions ou
                d'erreurs. BookNest ne peut être tenu responsable :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-8 mt-2">
                <li>De l'annulation ou de la modification d'un événement par l'organisateur</li>
                <li>Des dommages indirects liés à l'utilisation de la plateforme</li>
                <li>De la perte de données en cas de problème technique</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                <strong>6.2 Responsabilité de l'utilisateur :</strong>
              </p>
              <p className="text-gray-600 leading-relaxed ml-4">
                Vous êtes responsable de l'utilisation de votre compte et de toutes les actions
                effectuées avec vos identifiants.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Propriété intellectuelle
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Tous les éléments de la plateforme BookNest (textes, images, logos, code source)
                sont protégés par le droit d'auteur. Toute reproduction, distribution ou
                utilisation non autorisée est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Données personnelles
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Le traitement de vos données personnelles est détaillé dans notre{' '}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                  Politique de confidentialité
                </Link>
                . En utilisant BookNest, vous acceptez les modalités de traitement de vos données.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Suspension et résiliation
              </h2>
              <p className="text-gray-600 leading-relaxed">
                BookNest se réserve le droit de suspendre ou de résilier votre compte en cas de :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Non-respect des présentes CGU</li>
                <li>Comportement frauduleux ou abusif</li>
                <li>Fourniture d'informations fausses ou trompeuses</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Vous pouvez demander la suppression de votre compte à tout moment en nous
                contactant.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Modifications des CGU
              </h2>
              <p className="text-gray-600 leading-relaxed">
                BookNest se réserve le droit de modifier les présentes CGU à tout moment. Les
                modifications seront publiées sur cette page et entreront en vigueur
                immédiatement. Votre utilisation continue de la plateforme après les
                modifications constitue votre acceptation des nouvelles CGU.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                <strong>Dernière mise à jour :</strong> 10 février 2026
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Droit applicable
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Les présentes CGU sont soumises au droit français. En cas de litige, les
                tribunaux français seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Contact
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant ces conditions générales d'utilisation, vous
                pouvez nous contacter à :
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Email :</strong>{' '}
                  <a href="mailto:contact@booknest.com" className="text-orange-600 hover:text-orange-700">
                    contact@booknest.com
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
