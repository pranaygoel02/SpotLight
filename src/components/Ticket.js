import React, { useEffect, useRef, useState } from "react";
import { Avatars } from "appwrite";
import client from "../appwrite.config";
import Loading from "./Loading";
import Barcode from "../assets/images/barcode.png";
import { RiDownloadFill } from "react-icons/ri";
import { exportComponentAsPNG } from "react-component-export-image";

function Ticket({ text, event }) {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    const getQR = async () => {
      try {
        setLoading((prev) => true);
        setError((prev) => null);
        const avatars = new Avatars(client);
        const response = avatars.getQR(text, 400);
        setQr((prev) => response);
      } catch (err) {
        setError((prev) => err);
      } finally {
        setLoading((prev) => false);
      }
    };

    getQR();
  }, [text]);

  const download = (e) => {
    e?.preventDefault();
    exportComponentAsPNG(ticketRef, { fileName: `ticket.png` });
  };

  useEffect(() => {
    if(!loading && qr) download()
  },[loading, qr])

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <section
        id="ticket"
        ref={ticketRef}
        className="flex items-center justify-between font-grostek text-black w-[1024px] h-[400px] m-10  drop-shadow-xl"
        style={{
          boxSizing: "border-box",
        }}
      >
        <div className="rounded-l-[18px] bg-primary p-2 h-full text-white flex items-center justify-center">
          <img alt="Barcode" src={Barcode} className="w-full h-[80%] object-contain m-auto" />
        </div>
        <div
          className="col-span-4 relative bg-slate-200 w-full h-full border-l-[3px] border-r-[3px] border-spacing-2 border-dashed border-l-primary border-r-secondary"
          style={{
            backgroundImage: `url(${event?.image})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="grid grid-cols-2 absolute bottom-0 w-full left-0 bg-accent p-4 text-white">
            <h1>Event Name: {event?.title}</h1>
            <h2>
              Event Date:{" "}
              {new Date(event?.startDate?.split("+")[0]).toDateString()}
            </h2>
            <h3>
              Event Time:{" "}
              {new Date(event?.startDate?.split("+")[0])
                .toTimeString()
                .slice(0, 5)}
            </h3>
            <h4>Event Location: {event?.location[0]}</h4>
          </div>
        </div>
        <div className="p-16 h-full flex flex-col items-center justify-center gap-4 rounded-r-[18px] bg-secondary">
          <img
            alt="QR Code"
            src={qr}
            className="m-0 outline-dashed outline-1 outline-neutral-300 outline-offset-8"
          />
          <p className="font-bold uppercase text-white">Admit One</p>
        </div>
      </section>
      <button className="primary-btn" onClick={download}>
        <RiDownloadFill /> Download
      </button>
    </div>
  );
}

export default Ticket;
