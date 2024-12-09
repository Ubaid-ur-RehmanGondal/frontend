import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const {
    data: events,
    eventsLoading,
    refetch,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: handleAttendEvent } = useMutation({
    mutationFn: async (eventId) => {
      try {
        const res = await fetch("/api/events/add-attendee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId, userId: authUser?._id }),
        });
        const data = await res.json();

        if(res.status !== 200) {
          toast.error(data?.message); 
        }
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      toast.success("Event Attend Request successful!");
      refetch();
    },
  });

  const { follow, isPending } = useFollow();
  // if (suggestedUsers?.filter((user) => !user?.isAdmin)?.length === 0)
  //   return <div className="md:w-64 w-0"></div>;

  console.log(authUser?._id)
  return (
    <div className="hidden md:w-64 w-0 lg:block my-4 mx-2">
      {suggestedUsers?.filter((user) => !user?.isAdmin)?.length === 0 ? (
        <></>
      ) : (
        <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
          <p className="font-bold mb-3">Who to follow</p>
          <div className="flex flex-col gap-4">
            {/* item */}
            {(isLoading || eventsLoading) && (
              <>
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
              </>
            )}
            {!isLoading &&
              suggestedUsers
                ?.filter((user) => !user?.isAdmin)
                ?.map((user) => (
                  <Link
                    to={`/profile/${user.username}`}
                    className="flex items-center justify-between gap-4"
                    key={user._id}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              user.profilePicture || "/avatar-placeholder.png"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold tracking-tight truncate w-28">
                          {user.fullName}
                        </span>
                        <span className="text-sm text-slate-500">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          follow(user._id);
                        }}
                      >
                        {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                      </button>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      )}

      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold mb-3">Ongoing events</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {(isLoading || eventsLoading) && (
            <>
              <RightPanelSkeleton />
            </>
          )}
          {!eventsLoading &&
            !isLoading &&
            events?.map((event) => {
              return (
                <div key={event?._id} className="mb-4">
                  <img src={event?.coverImage} width={"100%"} />
                  <p className="font-bold text-lg mt-2">{event?.title}</p>
                  <p className="text-xs">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  {event.attendees?.map(a => a?._id)?.includes(authUser?._id) ?  <button
                    onClick={() => {}}
                    className="mt-3 border rounded-full px-3 bg-primary"
                  >
                    Booked
                  </button>: 
                  <button
                    onClick={() => handleAttendEvent(event?._id)}
                    className="mt-3 border rounded-full px-3 border-primary"
                  >
                    Attend
                  </button>
                  }
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
