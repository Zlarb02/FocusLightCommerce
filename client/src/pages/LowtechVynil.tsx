import PolaroidPage from "./PolaroidPage";

export default function LowtechVynil() {
  return (
    <PolaroidPage
      title="Lowtech Vynil"
      subtitle="Nostalgie analogique dans un monde numérique"
      imagePath="/images/lowtech-vynil.jpg"
      date="Automne 2023"
      description={
        <>
          <p>
            "Lowtech Vynil" est un projet qui célèbre la beauté des technologies
            analogiques dans notre monde ultra-connecté. Cette œuvre est un
            hommage au disque vinyle, symbole de la pureté sonore et de
            l'authenticité artistique.
          </p>
          <p>
            À travers cette création, j'explore le contraste entre
            l'imperfection chaleureuse des médias analogiques et la perfection
            froide du numérique. Le grain, les craquements, la texture tangible
            – tous ces éléments qui ont été sacrifiés sur l'autel de la
            commodité digitale sont ici revalorisés et célébrés.
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-10">
          <div className="bg-gray-900 text-gray-100 p-8 rounded-xl">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              La philosophie Lowtech
            </h3>
            <p className="mb-4">
              Le mouvement lowtech prône un retour à des technologies plus
              simples, plus durables et plus réparables. Dans un contexte
              d'obsolescence programmée et de consommation effrénée, cette
              approche nous invite à reconsidérer notre rapport aux objets et à
              privilégier qualité et longévité plutôt que nouveauté éphémère.
            </p>
            <p>
              À travers le vinyle, médium qui a survécu à l'ère numérique et
              connaît aujourd'hui une renaissance, je questionne notre rapport à
              la matérialité et à la durabilité dans l'art et dans nos vies
              quotidiennes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-titles)" }}
              >
                Processus créatif
              </h3>
              <p className="text-gray-700">
                Pour ce projet, j'ai collecté d'anciens vinyles dans les
                brocantes locales, cherchant spécifiquement ceux qui portaient
                les marques du temps. Chaque rayure, chaque trace d'usure
                raconte une histoire – celle d'une musique aimée, écoutée et
                réécoutée.
              </p>
              <p className="text-gray-700 mt-3">
                Ces disques ont ensuite été transformés en utilisant diverses
                techniques mixtes, préservant leur essence tout en leur donnant
                une nouvelle vie artistique. La circularité du vinyle devient
                ainsi métaphore du cycle créatif : transformation, renaissance,
                réinterprétation.
              </p>
            </div>
            <div className="bg-white p-4 shadow-lg">
              <img
                src="/images/lowtech-vynil-process.jpg"
                alt="Processus de création Lowtech Vynil"
                className="w-full h-auto"
              />
              <p className="mt-2 text-sm text-gray-500 italic text-center">
                Étapes de transformation d'un vinyle de collection
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}
