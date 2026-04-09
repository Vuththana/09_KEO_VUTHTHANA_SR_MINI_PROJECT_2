import FooterComponent from "../../components/FooterComponent";
import NavbarComponent from "../../components/NavbarComponent";
import { auth } from "@/auth";

export default async function SiteLayout({ children }) {
  const session = await auth()
  
  return (
    <>
      <NavbarComponent session={session}/>
      <main className="flex-1">{children}</main>
      <FooterComponent />
    </>
  );
}
