import { useState, useEffect, useRef, useCallback } from "react";
import client from "../../appwrite.config";
import { Databases, Storage, ID, Teams } from "appwrite";
import { categories } from "./categories";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

function CreateEventLogic() {
  const [validateMessage, setValidateMessage] = useState(null);
  const [signingin, setSigningin] = useState(false);

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  

  const navigate = useNavigate();

  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(null);
  const [language, setLanguage] = useState(null);
  const [maxParticipants, setMaxParticipants] = useState(null);
  const [category, setCategory] = useState("");
  const [medium, setMedium] = useState("offline");
  const [meetLink, setMeetLink] = useState("");
  const [meetId, setMeetId] = useState("");
  const [meetPassword, setMeetPassword] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [fetchedDoc, setFetchedDoc] = useState(null);
  const [fetchingDoc, setFetchingDoc] = useState(false);
  const [imageId, setImageId] = useState(null);
  const [tnc, setTnc] = useState(null);
  const [acceptingAttendance, setAcceptingAttendance] = useState(false);
  const [acceptingRsvp, setAcceptingRsvp] = useState(false);

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageError("");
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const getEventById = useCallback(async () => {
    try {
      setFetchingDoc((prev) => true);
      const database = new Databases(client);
      const response = await database.getDocument(
        process.env.REACT_APP_DATABASE_ID,
        process.env.REACT_APP_EVENTS_COLLECTION_ID,
        id
      );
      
      const {
        title,
        description,
        location,
        startDate,
        endDate,
        maxParticipants,
        category,
        medium,
        meet,
        privacy,
        image,
        imageId,
        duration,
        language,
        tnc,
        acceptingAttendance,
        acceptingRsvp
      } = response;
      setFetchedDoc((prev) => response);
      setTitle((prev) => title);
      setDescription((prev) => description);
      setLocation((prev) => location[0]);
      setLatitude((prev) => location[1]);
      setLongitude((prev) => location[2]);
      setStartDate((prev) => startDate?.split("+")[0]);
      setEndDate((prev) => endDate?.split("+")[0]);
      setDuration((prev) => duration);
      setLanguage((prev) => language);
      setMaxParticipants((prev) => maxParticipants);
      setCategory((prev) => category);
      setMedium((prev) => medium);
      setMeetLink((prev) => meet[0]);
      setMeetId((prev) => meet[1]);
      setMeetPassword((prev) => meet[2]);
      setPrivacy((prev) => privacy);
      setImage((prev) => image);
      setImagePreview((prev) => image);
      setImageId((prev) => imageId);
      setTnc((prev) => tnc);
      setAcceptingAttendance((prev) => acceptingAttendance);
      setAcceptingRsvp((prev) => acceptingRsvp);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFetchingDoc((prev) => false);
    }
  }, [id]);

  useEffect(() => {
    if (id) getEventById();
  }, [getEventById]);

  const getUpdatedValues = (value) => {
    const updatedObj = {};
    if (value.title !== fetchedDoc?.title) {
      updatedObj.title = title;
    }
    if(value?.acceptingAttendance !== fetchedDoc?.acceptingAttendance) {
      updatedObj.acceptingAttendance = acceptingAttendance;
    }
    if(value?.acceptingRsvp !== fetchedDoc?.acceptingRsvp) {
      updatedObj.acceptingRsvp = acceptingRsvp;
    }
    if (value.tnc !== fetchedDoc?.tnc) {
      updatedObj.tnc = tnc;
    }
    if (value.description !== fetchedDoc?.description) {
      updatedObj.description = description;
    }
    if (
      new Date(value.startDate).toUTCString() !==
      new Date(fetchedDoc?.startDate?.split("+")[0]).toUTCString()
    ) {
      updatedObj.startDate = startDate.length > 0 ? startDate : null;
    }
    if (
      new Date(value.endDate).toUTCString() !==
      new Date(fetchedDoc?.endDate?.split("+")[0]).toUTCString()
    ) {
      updatedObj.endDate = endDate?.length > 0 ? endDate : null;
    }
    if (value?.maxParticipants !== fetchedDoc?.maxParticipants) {
      updatedObj.maxParticipants = maxParticipants;
    }
    if(value?.duration !== fetchedDoc?.duration) {
      updatedObj.duration = duration;
    }
    if(value?.language !== fetchedDoc?.language) {
      updatedObj.language = language;
    }
    if (value.category !== fetchedDoc?.category) {
      updatedObj.category = category;
    }
    if (value.privacy !== fetchedDoc?.privacy) {
      updatedObj.privacy = privacy;
    }
    if (value.imageId !== fetchedDoc?.imageId) {
      updatedObj.imageId = value.imageId;
      updatedObj.image = value.image;
    }
    if (value.medium !== fetchedDoc?.medium) {
      updatedObj.medium = medium;
    }
    updatedObj.location = value.location;
    updatedObj.meet = value.meet;
    return updatedObj;
  };

  const handleCreateEvent = async (e) => {
    e?.preventDefault();
    const token = JSON.parse(localStorage.getItem("token"));
    
    setSigningin((prev) => true);
    setValidateMessage((prev) => null);
    try {
      if (!title) {
        throw new Error("Please provide a title for your event.");
      }
      if (!description) {
        throw new Error("Please provide a description for your event.");
      }
      if (!privacy) {
        throw new Error("Please provide a privacy for your event.");
      }
      if (!startDate) {
        throw new Error("Please provide a start date for your event.");
      }
      if (endDate) {
        if (new Date(endDate) < new Date(startDate)) {
          throw new Error("End date cannot be before start date.");
        }
      }
      if (!category) {
        throw new Error("Please provide a category for your event.");
      }
      if (medium === "offline") {
        if (!location) {
          throw new Error("Please provide a location for your event.");
        }
        if (!latitude) {
          throw new Error("Please provide a latitude for your event.");
        }
        if (!longitude) {
          throw new Error("Please provide a longitude for your event.");
        }
      }
      // if (medium === "online") {
      //   if (!meetLink) {
      //     throw new Error("Please provide a meeting link for your event.");
      //   }
      //   if (!meetId) {
      //     throw new Error("Please provide a meeting id for your event.");
      //   }
      // }
      if (image === null) {
        throw new Error("Please provide an image for your event.");
      }
      try {
        let uploadedFile, filePreviewUrl;
        const storage = new Storage(client);
        if (typeof image !== "string") {
          if (fetchedDoc?.imageId) {
            const deletedFile = await storage.deleteFile(
              process.env.REACT_APP_IMAGES_BUCKET_ID,
              fetchedDoc?.imageId
            );
            
          }
          uploadedFile = await storage.createFile(
            process.env.REACT_APP_IMAGES_BUCKET_ID,
            ID.unique(),
            image
          );
          
          filePreviewUrl = await storage.getFilePreview(
            uploadedFile.bucketId,
            uploadedFile.$id
          );
          
        } else if (image === null) {
          const deletedFile = await storage.deleteFile(
            process.env.REACT_APP_IMAGES_BUCKET_ID,
            fetchedDoc?.imageId
          );
          
          filePreviewUrl = null;
        } else {
          filePreviewUrl = image;
        }
        const value = {
          title,
          description,
          medium,
          startDate,
          endDate,
          category,
          maxParticipants: String(maxParticipants).length === 0 ? 0 : maxParticipants,
          location:
            medium === "online"
              ? []
              : [String(location), String(latitude), String(longitude)],
          meet:
            medium === "offline"
              ? []
              : [String(meetLink), String(meetId), String(meetPassword)],
          privacy,
          createdBy: token.userId,
          image: filePreviewUrl,
          imageId: filePreviewUrl ? uploadedFile?.$id : fetchedDoc?.imageId,
          tnc,
          acceptingAttendance,
          duration,
          language,
          acceptingRsvp
        };
        const updatedValues = id ? getUpdatedValues(value) : value;
        
        const databases = new Databases(client);
        const teams = new Teams(client);
        let teamId;
        if (id === undefined || id === null || id === "" || !id) {
          const teamResponse = await teams.create(ID.unique(), title);
          
          teamId = teamResponse.$id;
        }
        const response = id
          ? await databases.updateDocument(
              process.env.REACT_APP_DATABASE_ID,
              process.env.REACT_APP_EVENTS_COLLECTION_ID,
              id,
              updatedValues
            )
          : await databases.createDocument(
              process.env.REACT_APP_DATABASE_ID,
              process.env.REACT_APP_EVENTS_COLLECTION_ID,
              ID.unique(),
              { ...value, teamId }
            );
        
        if(title !== fetchedDoc?.title) {
          const teamNameUpdate = await teams.updateName(teamId, title);
          
        }
        // const updateTeamPreferences = await teams.updatePrefs( teamId, {...fetchedDoc?, ...response } )
        // 
        toast.success(`Event ${id ? "updated" : "created"} successfully`);
        navigate(-1);
      } catch (error) {
        
        setValidateMessage((prev) => error.message);
        toast.error(error.message);
      }
    } catch (err) {
      
      toast.error(err.message);
    } finally {
      setSigningin((prev) => false);
    }
  };

  const inputs = [
    {
      label: "Title",
      placeholder: "Please provide a title for your event.",
      value: title,
      cb: setTitle,
      show: true,
      required: true,
    },
    {
      label: "Description",
      value: description,
      placeholder: "Please provide a description of your event.",
      cb: setDescription,
      multiline: true,
      show: true,
      required: true,
      type: "textarea",
    },
    {
      label: "Privacy",
      value: privacy,
      placeholder: "Please provide a medium for your event.",
      cb: setPrivacy,
      options: [
        {
          label: "Public",
          value: "public",
        },
        {
          label: "Private",
          value: "private",
        },
      ],
      show: true,
      required: true,
    },
    {
      label: "Medium",
      value: medium,
      placeholder: "Please provide a medium for your event.",
      cb: setMedium,
      options: [
        {
          label: "Online",
          value: "online",
        },
        {
          label: "In Person",
          value: "offline",
        },
      ],
      show: true,
      required: true,
    },
    {
      label: "Start Date-Time",
      value: startDate,
      placeholder: "Please provide a start date for your event.",
      cb: setStartDate,
      show: true,
      required: true,
      type: "datetime-local",
    },
    {
      label: "End Date-Time",
      value: endDate,
      placeholder: "Please provide an end date for your event.",
      cb: setEndDate,
      show: true,
      type: "datetime-local",
    },
    {
      label: "Duration",
      value: duration,
      placeholder: "Please provide a duration for your event. (hh:mm)",
      cb: setDuration,
      show: true,
      type: "string",
    },
    {
      label: "Language",
      value: language,
      placeholder: "Please provide a language for your event.",
      cb: setLanguage,
      show: true,
      type: "string",
    },
    {
      label: "Max Participants (i.e. RSVPs)",
      value: maxParticipants,
      placeholder:
        "Please provide a maximum number of participants for your event.",
      cb: setMaxParticipants,
      type: "number",
      show: true,
    },
    {
      label: "Category",
      value: category,
      placeholder: "Please provide a category for your event.",
      cb: setCategory,
      show: true,
      options: categories,
      required: true,
    },
    {
      label: "Terms and Conditions",
      value: tnc,
      placeholder: "Please provide terms and conditions for your event.",
      cb: setTnc,
      multiline: true,
      show: true,
      type: "textarea",
    },
    {
      label: "Location Name",
      value: location,
      placeholder: "Please provide a location for your event.",
      cb: setLocation,
      show: medium === "offline",
      required: medium === "offline",
    },
    {
      label: "Latitude",
      value: latitude,
      placeholder: "Please provide a latitude for your event.",
      cb: setLatitude,
      inputMode: "numeric",
      show: medium === "offline",
      required: medium === "offline",
    },
    {
      label: "Longitude",
      value: longitude,
      placeholder: "Please provide a longitude for your event.",
      cb: setLongitude,
      inputMode: "numeric",
      show: medium === "offline",
      required: medium === "offline",
    },
    {
      label: "Meet Link",
      value: meetLink,
      placeholder: "Please provide a meet link for your event.",
      cb: setMeetLink,
      type: "url",
      show: medium === "online",
    },
    {
      label: "Meet ID",
      value: meetId,
      placeholder: "Please provide a meet ID for your event.",
      cb: setMeetId,
      show: medium === "online",
    },
    {
      label: "Meet Password",
      value: meetPassword,
      placeholder: "Please provide a meet password for your event.",
      cb: setMeetPassword,
      show: medium === "online",
    },
    // {
    //   label: "Accepting Attendances",
    //   value: acceptingAttendance,
    //   // placeholder: "Please provide a meet password for your event.",
    //   cb: setAcceptingAttendance,
    //   show: true,
    //   options: [
    //     {
    //       label: "Yes",
    //       value: true,
    //     },
    //     {
    //       label: "No",
    //       value: false,
    //     },
    //   ],
    // },
    {
      label: "Accepting RSVPs",
      value: acceptingRsvp,
      // placeholder: "Please provide a meet password for your event.",
      cb: setAcceptingRsvp,
      show: true,
      options: [
        {
          label: "Yes",
          value: true,
        },
        {
          label: "No",
          value: false,
        },
      ],
    }
  ];

  const removeImage = (e) => {
    e?.preventDefault();
    setImagePreview((prev) => null);
    setImage((prev) => null);
  };

  return {
    inputs,
    validateMessage,
    signingin,
    setSigningin,
    setValidateMessage,
    imageError,
    setImageError,
    fileRef,
    handleCreateEvent,
    handleImage,
    imagePreview,
    setImagePreview,
    setImage,
    removeImage,
    id,
    fetchingDoc,
  };
}
export default CreateEventLogic;
