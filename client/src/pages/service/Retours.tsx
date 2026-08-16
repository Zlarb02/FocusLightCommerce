import { SitePageView } from "@/components/cms/SitePageView";

/**
 * Retours — page annexe entièrement pilotée depuis la gestion
 * (« Pages du site »). La structure comme les textes viennent de
 * `data/sitePages.json` : plus rien à toucher ici pour changer le contenu.
 */
export default function Retours() {
  return <SitePageView slug="retours" fallbackTitleKey="retours.title" />;
}
