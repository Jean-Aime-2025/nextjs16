import { redirect } from "next/navigation";

const HomePage = () => {
  redirect("/blog");
};

export default HomePage;
