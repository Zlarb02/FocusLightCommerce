import PolaroidPage from "./PolaroidPage";

export default function Waterfall() {
  return (
    <PolaroidPage
      title="Waterfall"
      subtitle="Fluidité graphique et chorégraphie visuelle"
      imagePath="/images/waterfall.jpg"
      date="Printemps 2023"
      description={
        <>
          <p>
            "Waterfall" est une série d'œuvres qui explore le mouvement
            perpétuel et la fluidité. Inspirée par les cascades naturelles,
            cette collection capture l'essence de l'eau en mouvement à travers
            des formes abstraites et des nuances chromatiques subtiles.
          </p>
          <p>
            Chaque pièce représente un instant figé dans la chute d'eau, tout en
            suggérant la continuité du mouvement. Les textures créent une
            profondeur qui invite le spectateur à plonger dans un univers à la
            fois apaisant et dynamique.
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-3 shadow-md">
              <img
                src="/images/waterfall-detail-1.jpg"
                alt="Détail Waterfall 1"
                className="w-full h-auto object-cover aspect-square"
              />
              <p className="mt-2 text-sm text-gray-600 text-center">
                Détail #1 - Écoulement
              </p>
            </div>
            <div className="bg-white p-3 shadow-md">
              <img
                src="/images/waterfall-detail-2.jpg"
                alt="Détail Waterfall 2"
                className="w-full h-auto object-cover aspect-square"
              />
              <p className="mt-2 text-sm text-gray-600 text-center">
                Détail #2 - Immersion
              </p>
            </div>
            <div className="bg-white p-3 shadow-md">
              <img
                src="/images/waterfall-detail-3.jpg"
                alt="Détail Waterfall 3"
                className="w-full h-auto object-cover aspect-square"
              />
              <p className="mt-2 text-sm text-gray-600 text-center">
                Détail #3 - Réflexion
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              La symbolique de l'eau
            </h3>
            <p className="text-gray-700">
              Dans cette œuvre, l'eau symbolise à la fois la force et la
              douceur, la constance et le changement. Elle représente le flux
              créatif qui anime mon travail artistique, toujours en mouvement et
              en évolution. "Waterfall" est aussi une invitation à lâcher prise,
              à se laisser porter par le courant de la vie et à embrasser le
              changement.
            </p>
          </div>
        </div>
      }
    />
  );
}
