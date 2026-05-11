import {redirect} from "next/navigation";

const Home = async () => {
  redirect("/login");
};

export default Home;
