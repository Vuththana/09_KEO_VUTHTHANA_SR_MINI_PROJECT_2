import { getCurrentUserAction } from "@/action/user.action";
import FooterComponent from "../../components/FooterComponent";
import NavbarComponent from "../../components/NavbarComponent";
import { auth } from "@/auth";

export default async function SiteLayout({ children }) {
  const session = await auth();
  let currentUser = null;
  if(session != null) {
    currentUser = await getCurrentUserAction();
  }
  return (
    <>
      <NavbarComponent session={session} currentUser={currentUser} />
      <main className="flex-1">{children}</main>
      <FooterComponent />
    </>
  );
}
