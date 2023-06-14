import React from "react";
import GetEventLogic from "../../Logic/EventsLogic/getEvents";
import Loading from "../../components/Loading";
import {
  MdCategory,
  MdComputer,
  MdCurrencyRupee,
  MdRsvp,
} from "react-icons/md";
import {
  IoBookmarkOutline,
  IoCalendar,
  IoCalendarClearOutline,
  IoLocation,
  IoLocationOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { shareLinks } from "../../static/shareLinks";
import { useLocation } from "react-router-dom";
import RsvpLogic from "../../Logic/Explore/rsvp.logic";

function EventPage() {
  const { loading, error, events, id } = GetEventLogic();
  const { token, cookieFallback, handleRSVP, checkUserIsOwner, adding } =
    RsvpLogic(events);
  console.log(events);

  const { pathname } = useLocation();

  if (loading || !events) return <Loading />;

  if (error) return <div>{error}</div>;

  const {
    $id,
    title,
    description,
    medium,
    privacy,
    price,
    category,
    startDate,
    endDate,
    location,
    image,
    meet,
    tnc,
  } = events;

  const start = startDate ? new Date(startDate?.split("+")[0]) : null;
  const end = endDate ? new Date(endDate?.split("+")[0]) : null;
  const startDay = start?.toDateString();
  const endDay = end?.toDateString();
  const startTime = start?.toTimeString()?.slice(0, 5);
  const endTime = end?.toTimeString()?.slice(0, 5);

  const RSVPBtn = () => (
    <button
      disabled={adding}
      onClick={handleRSVP}
      className="primary-btn disabled:opacity-60"
    >
      {price <= 0 ? "RSVP" : "BUY NOW"}
    </button>
  );

  return (
    <section className="container py-8 pb-16 w-full font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:items-start">
        <div className="col-span-4 space-y-4">
          <img
            src={image}
            className="rounded-lg w-full aspect-video object-cover"
          />
          <div className="flex flex-col md:hidden w-full space-y-4">
            <div className="rounded-lg flex flex-col gap-4 outline w-full outline-1 outline-neutral-300 p-6">
              <h2 className="font-bold text-xl">{title}</h2>
              <h2 className="inline-flex items-center gap-2 text-sm">
                <IoBookmarkOutline /> {category}
              </h2>
              <h2 className="inline-flex items-center gap-2 text-sm">
                <IoCalendarClearOutline /> {startDay}, {startTime}
                {startDay === endDay && ` | ${endTime}`}
              </h2>
              {startDay !== endDay && endDate && endDay && (
                <h2 className="inline-flex items-center gap-2 text-sm">
                  <IoBookmarkOutline /> {endDay}, {endTime}
                </h2>
              )}
              <h2 className="inline-flex flex-wrap items-center gap-2 text-sm">
                {medium === "offline" ? (
                  <>
                    <IoLocationOutline />
                    <span className="flex-1">{location[0]}</span>
                    <iframe
                      className="w-full h-max outline outline-1 outline-neutral-300 shadow-md rounded-lg flex-1 mt-2"
                      src={`https://maps.google.com/maps?q=${location[1]},${location[2]}&hl=en&output=embed`}
                    ></iframe>
                  </>
                ) : (
                  <>
                    <MdComputer />
                    {meet[0] || "Online"}
                  </>
                )}
              </h2>
              <div className="inline-flex items-center justify-between w-full">
                <h2 className="inline-flex items-center gap-2 font-extrabold font-grostek text-xl mt-2">
                  <IoWalletOutline />{" "}
                  {price <= 0 ? (
                    "Free"
                  ) : (
                    <>
                      <MdCurrencyRupee />
                      {price}
                    </>
                  )}
                </h2>

                <RSVPBtn />
              </div>
            </div>
            <div className="inline-flex w-full items-center gap-2">
              <div className="mr-auto">
                <h2 className="font-semibold text-lg">Invite your friends</h2>
                <p className="text-xs text-neutral-500 font-grostek">
                  and enjoy a shared experience!
                </p>
              </div>
              {shareLinks?.map((link, index) => (
                <a
                  href={link?.share(
                    `${window.location.origin}${pathname}`,
                    title
                  )}
                  target="_blank"
                  title={`Share on ${link?.title}`}
                  className={`border flex items-center justify-center rounded-full p-2 text-xl hover:scale-125 transition-all text-white bg-gradient-to-br ${link?.color}`}
                >
                  {link?.icon}
                </a>
              ))}
            </div>
          </div>
          <h2 className="font-semibold py-2 border-b border-neutral-300 text-lg">
            About
          </h2>
          <div className="display-linebreak text-neutral-800 text-sm font-grostek">
            {description}
          </div>
          {tnc && (
            <>
              <h2 className="font-semibold py-2 border-b border-neutral-300 text-lg">
                Terms and Conditions
              </h2>
              <ul className="display-linebreak text-neutral-800 text-sm font-grostek list-disc">
                {tnc?.split("\n")?.map(t => (
                  <li>{t}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="col-span-2 hidden md:block w-full space-y-4">
          <div className="rounded-lg flex flex-col gap-4 outline w-full  outline-1 outline-neutral-300 p-6">
            <h2 className="font-bold text-xl">{title}</h2>
            <h2 className="inline-flex items-center gap-2 text-sm">
              <IoBookmarkOutline /> {category}
            </h2>
            <h2 className="inline-flex items-center gap-2 text-sm">
              <IoCalendarClearOutline /> {startDay}, {startTime}
              {startDay === endDay && ` | ${endTime}`}
            </h2>
            {startDay !== endDay && endDate && endDay && (
              <h2 className="inline-flex items-center gap-2 text-sm">
                <IoBookmarkOutline /> {endDay}, {endTime}
              </h2>
            )}
            <h2 className="inline-flex flex-wrap items-center gap-2 text-sm">
              {medium === "offline" ? (
                <>
                  <IoLocationOutline />
                  <span className="flex-1">{location[0]}</span>
                  <iframe
                    className="w-full h-max outline outline-1 outline-neutral-300 shadow-md rounded-lg flex-1 mt-2"
                    src={`https://maps.google.com/maps?q=${location[1]},${location[2]}&hl=en&output=embed`}
                  ></iframe>
                </>
              ) : (
                <>
                  <MdComputer />
                  {meet[0] || "Online"}
                </>
              )}
            </h2>
            <div className="inline-flex items-center justify-between w-full">
              <h2 className="inline-flex items-center gap-2 font-extrabold font-grostek text-xl mt-2">
                <IoWalletOutline />{" "}
                {price <= 0 ? (
                  "Free"
                ) : (
                  <>
                    <MdCurrencyRupee />
                    {price}
                  </>
                )}
              </h2>

              <RSVPBtn />
            </div>
          </div>
          <div className="inline-flex w-full items-center gap-2">
            <div className="mr-auto">
              <h2 className="font-semibold text-lg">Invite your friends</h2>
              <p className="text-xs text-neutral-500 font-grostek">
                and enjoy a shared experience!
              </p>
            </div>
            {shareLinks?.map((link, index) => (
              <a
                href={link?.share(
                  `${window.location.origin}${pathname}`,
                  title
                )}
                target="_blank"
                title={`Share on ${link?.title}`}
                className={`border flex items-center justify-center rounded-full p-2 text-xl hover:scale-125 transition-all text-white bg-gradient-to-br ${link?.color}`}
              >
                {link?.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventPage;
