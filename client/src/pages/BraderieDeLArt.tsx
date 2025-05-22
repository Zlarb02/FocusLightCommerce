import PolaroidPage from "./PolaroidPage";

export default function BraderieDeLArt() {
  return (
    <PolaroidPage
      title="Braderie de l'Art"
      subtitle="Exposition éphémère et créative"
      imagePath="/images/braderie-de-l-art.png"
      date="Novembre 2024"
      description={
        <>
          <p>
            La Braderie de l'Art représente un moment emblématique pour les
            artistes et artisans de la région. Ce rendez-vous annuel est
            l'occasion de présenter des créations uniques et de partager avec le
            public une vision artistique contemporaine.
          </p>
          <p>
            Ce polaroid capture l'essence même de cet événement : l'atmosphère
            effervescente, les œuvres aux styles variés et le dialogue qui
            s'établit entre créateurs et visiteurs. C'est un témoignage visuel
            de cette célébration de la création sous toutes ses formes.
          </p>
        </>
      }
      additionalContent={
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            À propos de la Braderie de l'Art
          </h3>
          <p className="text-gray-700 mb-4">
            Événement incontournable du Nord de la France, la Braderie de l'Art
            réunit chaque année des dizaines d'artistes autour d'un concept
            original : créer des œuvres en temps réel à partir de matériaux
            récupérés, le tout dans une ambiance festive et conviviale.
          </p>
          <p className="text-gray-700">
            La photographie présentée ici capte l'un des stands emblématiques de
            l'édition 2024, où les objets du quotidien se transforment en œuvres
            d'art sous le regard curieux des visiteurs.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="inline-block bg-white px-4 py-2 text-sm border border-gray-200">
              Prochain événement : Novembre 2025 - Roubaix
            </div>
          </div>
        </div>
      }
    />
  );
}
