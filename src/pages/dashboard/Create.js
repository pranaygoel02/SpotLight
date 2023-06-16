import React from "react";
import { IoClose } from "react-icons/io5";
import BackBtn from "../../components/BackBtn";
import CreateEventLogic from "../../Logic/EventsLogic/createEvent.logic";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { MdUpload } from "react-icons/md";
import Loading from "../../components/Loading";

function Create() {
  const {
    inputs,
    signingin,
    handleImage,
    imagePreview,
    fileRef,
    handleCreateEvent,
    removeImage,
    id,
    fetchingDoc
  } = CreateEventLogic();

  const pageTitle = id ? "Edit Event" : "Create Event";

  if(fetchingDoc) return (
    <Loading />
  )

  return (
    <div>
      <BackBtn to={"/dashboard"} />
      <div className="py-4">
        <h1 className="page-title">{pageTitle}</h1>
        <form onSubmit={handleCreateEvent} className="flex flex-col gap-6 pt-8">
          {inputs.map((input, index) => {
            return <Input {...input} key={index} />;
          })}
          <input
            ref={fileRef}
            type="file"
            onChange={handleImage}
            className="hidden"
          />
          <button
            onClick={(e) => {
              e?.preventDefault();
              fileRef.current.click();
            }}
            className="primary-btn self-start"
            style={{
              marginBlock: 0,
            }}
          >
            Upload Feauture Image <MdUpload />
          </button>
          {imagePreview && (
            <div className="w-60 outline outline-1 outline-neutral-300 h-100 object-cover rounded-[18px] relative overflow-hidden">
              <img alt="preview" className="w-full" src={imagePreview ?? ""} />
              <button onClick={removeImage} className="absolute top-0 right-0 m-2 bg-neutral-400 rounded-[18px] p-1 text-white shadow-md" title="Delete Image">
                <IoClose/>
              </button>
            </div>
          )}
          <Button type="submit" loading={signingin} text={pageTitle} />
        </form>
      </div>
    </div>
  );
}

export default Create;
