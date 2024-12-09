import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Posts from "../../components/common/Posts";
import { BiSearch } from "react-icons/bi";
import Post from "../../components/common/Post";
import UserCard from "../../components/common/UserCard";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("posts");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncingTimeout = useRef(null);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);  
      setSearchTerm(""); 
      setDebouncedSearchTerm(""); 
      return;
    }

    if (debouncingTimeout.current) {
      clearTimeout(debouncingTimeout.current);
    }

    debouncingTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(debouncingTimeout.current);
    };
  }, [searchTerm]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["searchResults", debouncedSearchTerm, filter],
    queryFn: async () => {
      try {
        if (!debouncedSearchTerm.trim()) return [];
        const response = await axios.get("/api/search", {
          params: {
            searchTerm: debouncedSearchTerm,
            type: filter,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching search results", error);
        return [];
      }
    },
    enabled: !!debouncedSearchTerm,
  });

  useEffect(() => {
    if (data) {
      setSearchResults(data);
    }
  }, [data]);

  return (
    <div className="search-page flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      <div className="flex items-center mb-4 w-full border-b border-gray-700">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="p-4 border=-0 outline-none w-full rounded"
        />
        <button
          onClick={() => setDebouncedSearchTerm(searchTerm)}
          className="ml-2 p-4 bg-primary text-white"
        >
          <BiSearch size={24} />
        </button>
      </div>

      <div className="px-5">
        <div className="filters mt-4 flex space-x-4">
          <button
            onClick={() => setFilter("posts")}
            className={`filter-btn ${filter === "posts" ? "active" : ""}`}
          >
            Posts
          </button>
          <button
            onClick={() => setFilter("users")}
            className={`filter-btn ${filter === "users" ? "active" : ""}`}
          >
            Users
          </button>
          <button
            onClick={() => setFilter("labels")}
            className={`filter-btn ${filter === "labels" ? "active" : ""}`}
          >
            Labels
          </button>
        </div>
      </div>

      <div className="search-results mt-6">
        {isLoading || isFetching ? (
          <p className="pl-5">Loading...</p>
        ) : (
          <>
            {filter === "posts" && (
              <div className="posts">
                {searchResults?.length === 0 ? (
                  debouncedSearchTerm ? (
                    <p className="pl-5">
                      No posts found {debouncedSearchTerm && "for \"" + debouncedSearchTerm + "\""}
                    </p>
                  ) : (
                    <div>
                      <h1 className="text-3xl pl-5 mb-5 font-bold">Trending posts</h1>
                      <Posts feedType={"forYou"} />
                    </div>
                  )
                ) : (
                  searchResults.map((post) => <Post key={post._id} post={post} />)
                )}
              </div>
            )}
            {filter === "users" && (
              <div className="users">
                {searchResults?.length === 0 ? (
                  <p className="pl-5">No users found {debouncedSearchTerm && "for " + "\"" + debouncedSearchTerm + "\""}</p>
                ) : (
                  searchResults.map((user) => (
                    <UserCard user={user} key={user._id}/>
                  ))
                )}
              </div>
            )}
            {filter === "labels" && (
              <div className="labels">
                {searchResults?.length === 0 ? (
                   <p className="pl-5">No labels found {debouncedSearchTerm && "for " + "\"" + debouncedSearchTerm + "\""}</p>
                ) : (
                   searchResults.map((post) => <Post key={post._id} post={post} />)

                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
