import type { Metadata } from "next";
import SiteHeader from "../site-header";
import SiteFooter from "../site-footer";
import FavouritesList from "./favourites-list";

export const metadata: Metadata = { title: "My favourites | Atelier", description: "Your saved wedding dresses and favourite bridal pieces at Atelier.", robots: { index: false, follow: true } };

export default function FavouritesPage() {
  return <main id="home" className="catalog-page"><SiteHeader catalog favourites /><FavouritesList /><SiteFooter /></main>;
}
