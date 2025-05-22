import PolaroidPage from "./PolaroidPage";

export default function QuiSuisJe() {
  return (
    <PolaroidPage
      title="Qui suis-je"
      subtitle="Artiste, créateur, explorateur visuel"
      imagePath="/images/qui-suis-je.jpg"
      description={
        <>
          <p>
            Je suis un artiste multidisciplinaire basé dans le Nord de la
            France, explorant les frontières entre l'art traditionnel et les
            nouvelles expressions créatives. Mon parcours artistique est jalonné
            d'expérimentations dans divers médiums – photographie, installation,
            design d'objets et art digital.
          </p>
          <p>
            Influencé par le patrimoine industriel de ma région et ses
            transformations, je m'intéresse particulièrement aux thèmes de la
            mémoire collective, de la transformation des espaces et du dialogue
            entre passé et présent. Mon travail cherche à créer des ponts entre
            l'héritage culturel local et les langages artistiques contemporains.
          </p>
          <p>
            La lumière joue un rôle central dans mes créations, non seulement
            comme médium mais aussi comme métaphore de révélation et de
            transformation. À travers mes œuvres, j'invite le spectateur à
            porter un regard nouveau sur le quotidien, à percevoir la beauté
            dans l'ordinaire, à questionner nos perceptions établies.
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Parcours
              </h3>
              <ul className="space-y-4">
                <li className="border-l-2 border-gray-300 pl-4 py-1">
                  <span className="text-sm text-gray-500 block">
                    2018-Présent
                  </span>
                  <span className="font-medium">
                    Artiste indépendant - Focus Light Studio
                  </span>
                </li>
                <li className="border-l-2 border-gray-300 pl-4 py-1">
                  <span className="text-sm text-gray-500 block">2016-2018</span>
                  <span className="font-medium">
                    Résidence artistique - Friche industrielle de La Belle de
                    Mai
                  </span>
                </li>
                <li className="border-l-2 border-gray-300 pl-4 py-1">
                  <span className="text-sm text-gray-500 block">2014-2016</span>
                  <span className="font-medium">
                    Master en Arts Visuels - École Supérieure d'Art de Lille
                  </span>
                </li>
                <li className="border-l-2 border-gray-300 pl-4 py-1">
                  <span className="text-sm text-gray-500 block">2010-2014</span>
                  <span className="font-medium">
                    Formation en design d'objets et scénographie - Paris
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Approche artistique
              </h3>
              <p className="text-gray-700 mb-4">
                Mon processus créatif démarre souvent par une observation
                attentive de l'environnement et des interactions humaines. Je
                collecte des fragments visuels, des matériaux, des histoires qui
                deviennent ensuite la matière première de mes créations.
              </p>
              <p className="text-gray-700">
                Je privilégie les matériaux recyclés et les techniques à faible
                impact environnemental, convaincu que l'art contemporain doit
                intégrer une dimension éthique et écologique. Cette contrainte
                volontaire devient un moteur d'innovation dans ma pratique.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Photographie",
                  "Installation",
                  "Sculpture lumineuse",
                  "Art digital",
                  "Design d'objets",
                  "Upcycling",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 px-3 py-1 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4 text-center"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Expositions récentes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 p-4 bg-white">
                <h4 className="font-medium">Lumières Urbaines</h4>
                <p className="text-sm text-gray-600">
                  Galerie Contemporaine, Lille - 2023
                </p>
              </div>
              <div className="border border-gray-200 p-4 bg-white">
                <h4 className="font-medium">Mémoires Industrielles</h4>
                <p className="text-sm text-gray-600">
                  Ancien site minier, Lens - 2022
                </p>
              </div>
              <div className="border border-gray-200 p-4 bg-white">
                <h4 className="font-medium">Interfaces</h4>
                <p className="text-sm text-gray-600">
                  Festival des Arts Numériques, Arras - 2022
                </p>
              </div>
              <div className="border border-gray-200 p-4 bg-white">
                <h4 className="font-medium">Traversées</h4>
                <p className="text-sm text-gray-600">
                  Biennale d'Art Contemporain, Roubaix - 2021
                </p>
              </div>
              <div className="border border-gray-200 p-4 bg-white">
                <h4 className="font-medium">Résonances</h4>
                <p className="text-sm text-gray-600">
                  Centre d'Art Le Plateau, Paris - 2021
                </p>
              </div>
              <div className="border border-gray-200 p-4 bg-white">
                <h4 className="font-medium">Second Souffle</h4>
                <p className="text-sm text-gray-600">
                  Friche artistique, Dunkerque - 2020
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <blockquote className="italic text-lg text-gray-700 max-w-2xl mx-auto">
              "Mon travail est une invitation à ralentir, à observer autrement
              notre environnement quotidien, à redécouvrir la poésie qui se
              cache dans les interstices de notre monde hyperconnecté et
              accéléré."
            </blockquote>
          </div>
        </div>
      }
    />
  );
}
