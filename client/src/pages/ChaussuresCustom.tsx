import PolaroidPage from "./PolaroidPage";

export default function ChaussuresCustom() {
  return (
    <PolaroidPage
      title="Chaussures Custom"
      subtitle="L'art à vos pieds"
      imagePath="/images/chaussures-custom.jpg"
      date="Été 2023"
      description={
        <>
          <p>
            Le projet "Chaussures Custom" est né d'une passion pour l'art
            accessible et portable. À l'intersection entre la mode et
            l'expression artistique, ces créations transforment des chaussures
            ordinaires en pièces uniques, véritables œuvres d'art ambulantes.
          </p>
          <p>
            Chaque paire est personnalisée à la main, avec une attention
            particulière portée aux détails. Les motifs s'inspirent de thèmes
            variés — abstraits, urbains, naturels — adaptés aux goûts et à la
            personnalité de chaque client. Plus qu'un simple accessoire, ces
            chaussures deviennent un moyen d'expression personnelle et un
            support artistique innovant.
          </p>
        </>
      }
      additionalContent={
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-3 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={`/images/custom-shoe-${i}.jpg`}
                  alt={`Chaussure customisée ${i}`}
                  className="w-full h-auto object-cover aspect-square"
                />
                <div className="mt-3 p-2">
                  <h4
                    className="font-medium text-center"
                    style={{ fontFamily: "var(--font-titles)" }}
                  >
                    Modèle{" "}
                    {i === 1
                      ? "Urban Flow"
                      : i === 2
                      ? "Nature Spirit"
                      : "Abstract Vision"}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Le processus de customisation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">1</span>
                </div>
                <h4 className="font-medium mb-2">Consultation</h4>
                <p className="text-sm text-gray-600">
                  Échange sur les préférences et le style souhaité
                </p>
              </div>
              <div>
                <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">2</span>
                </div>
                <h4 className="font-medium mb-2">Design</h4>
                <p className="text-sm text-gray-600">
                  Création du motif personnalisé
                </p>
              </div>
              <div>
                <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">3</span>
                </div>
                <h4 className="font-medium mb-2">Réalisation</h4>
                <p className="text-sm text-gray-600">
                  Application minutieuse des couleurs et motifs
                </p>
              </div>
              <div>
                <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">4</span>
                </div>
                <h4 className="font-medium mb-2">Finition</h4>
                <p className="text-sm text-gray-600">
                  Traitement protecteur pour une durabilité optimale
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black text-white p-8 rounded-lg text-center">
            <h3
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Envie d'une paire unique ?
            </h3>
            <p className="mb-6">
              Les commandes personnalisées sont actuellement ouvertes pour des
              chaussures custom. Chaque projet est une collaboration unique
              entre l'artiste et le client.
            </p>
            <div className="inline-block border border-white px-5 py-3">
              Contact : custom@focuslight.fr
            </div>
          </div>
        </div>
      }
    />
  );
}
