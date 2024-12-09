import { useQuery } from "@tanstack/react-query";
import Posts from "../../components/common/Posts.jsx";

const Bookmarks = () => {

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Bookmarks</p>
        </div>

        <Posts userId={authUser._id} feedType={"bookmarks"}/>
      </div>
    </>
  );
};
export default Bookmarks;
