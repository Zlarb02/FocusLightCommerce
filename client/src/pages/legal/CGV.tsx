import { SitePageView } from "@/components/cms/SitePageView";

/**
 * CGV — page annexe entièrement pilotée depuis la gestion
 * (« Pages du site »). La structure comme les textes viennent de
 * `data/sitePages.json` : plus rien à toucher ici pour changer le contenu.
 */
export default function CGV() {
  return <SitePageView slug="cgv" fallbackTitleKey="cgv.title" />;
}
