import { useState, useEffect, useRef } from "react";
import client from "../../appwrite.config";
import { Databases, Storage, ID } from "appwrite";
import { categories } from "./categories";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function CreateEventLogic() {
  const [validateMessage, setValidateMessage] = useState(null);
  const [signingin, setSigningin] = useState(false);

  const navigate = useNavigate();

  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [medium, setMedium] = useState("offline");
  const [meetLink, setMeetLink] = useState("");
  const [meetId, setMeetId] = useState("");
  const [meetPassword, setMeetPassword] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageError("");
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("token"));
    console.log(token);
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
        throw new Error("Please provide a start date for your event.")        
      }
      if (!endDate) {
        throw new Error("Please provide an end date for your event.");
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
      if (medium === "online") {
        if (!meetLink) {
          throw new Error("Please provide a meeting link for your event.");
        }
        if (!meetId) {
          throw new Error("Please provide a meeting id for your event.");
        }
      }
      if (image === null) {
        throw new Error("Please provide an image for your event.");
      }
      console.log({
        title,
        description,
        privacy,
        medium,
        startDate,
        endDate,
        category,
        location: [String(location), String(latitude), String(longitude)],
        meet: [String(meetLink), String(meetId), String(meetPassword)],
        price,
        createdBy: token.userId,
        image: image,
      });
      try {
        const storage = new Storage(client);
        const uploadedFile = await storage.createFile(process.env.REACT_APP_IMAGES_BUCKET_ID, ID.unique(), image);
        console.log(uploadedFile);
        const filePreviewUrl = await storage.getFilePreview(uploadedFile.bucketId, uploadedFile.$id);
        console.log(filePreviewUrl);
        const databases = new Databases(client);
        const response = await databases.createDocument(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_EVENTS_COLLECTION_ID,
          ID.unique(),
          {
            title,
            description,
            medium,
            startDate,
            endDate,
            category,
            maxParticipants,
            location: [String(location), String(latitude), String(longitude)],
            meet: [String(meetLink), String(meetId), String(meetPassword)],
            privacy,
            createdBy: token.userId,
            image: filePreviewUrl,
            price,
          }
        );
        console.log(response);
        toast.success("Event created successfully");
        navigate(-1);
      } catch (error) {
        console.log(error);
        setValidateMessage((prev) => error.message);
        toast.error(error.message);
      } 
    } catch(err) {
      console.log(err);
      toast.error(err.message);

    }
    finally {
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
      required: true,
      type: "datetime-local",
    },
    {
      label: "Max Participants",
      value: maxParticipants,
      placeholder:
        "Please provide a maximum number of participants for your event.",
      cb: setMaxParticipants,
      type: "number",
      show: true,
    },
    {
      label: "Price",
      value: price,
      placeholder: "Leave blank if it's a free event.",
      cb: setPrice,
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
      required: medium === "online",
    },
    {
      label: "Meet ID",
      value: meetId,
      placeholder: "Please provide a meet ID for your event.",
      cb: setMeetId,
      show: medium === "online",
      required: medium === "online",
    },
    {
      label: "Meet Password",
      value: meetPassword,
      placeholder: "Please provide a meet password for your event.",
      cb: setMeetPassword,
      show: medium === "online",
    },
  ];

  const removeImage = (e) => {
    e.preventDefault()
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
    removeImage
  };
}
export default CreateEventLogic;
