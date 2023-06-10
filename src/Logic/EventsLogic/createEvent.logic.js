import { useState, useEffect } from "react";
import client from "../../appwrite.config";
import { Databases, Storage } from "appwrite";
import { useNavigation, useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";
import categories from "./categories";
import * as ImagePicker from "expo-image-picker";
import { DATABASE_ID, EVENTS_COLLECTION_ID, IMAGES_BUCKET_ID } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

function createEventLogic() {
  const [validateMessage, setValidateMessage] = useState(null);
  const [signingin, setSigningin] = useState(false);

  const navigation = useNavigation();

  const { toast, setToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [medium, setMedium] = useState("offline");
  const [meetLink, setMeetLink] = useState("");
  const [meetId, setMeetId] = useState("");
  const [meetPassword, setMeetPassword] = useState("");
  const [privacy, setPrivacy] = useState("public");

  const [hasGalleryPermissions, setHasGalleryPermissions] = useState(null);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [images, setImages] = useState([]);

  // async function uploadImage(fileUri) {
  //   const storage = new Storage(client);
  //   const response = await fetch(fileUri);
  //   console.log(response);
  //   const file = new File(response, "image.jpg", "image/jpeg");
  //   console.log('File >>>> ',file);
  //   const fileResponse = await storage.createFile(IMAGES_BUCKET_ID, fileUri, file, ["*"], ["*"] );
  //   return fileResponse.$id;
  // }

  async function uploadImage(fileUri) {
    let format;
    if (fileUri.includes(".png?")) format = "png";
    else if (fileUri.includes(".jpg?")) format = "jpg";
    else if (fileUri.includes(".jpeg?")) format = "jpeg";
    else if (fileUri.includes(".gif?")) format = "gif";
    else if (fileUri.includes(".bmp?")) format = "bmp";
    else if (fileUri.includes(".webp?")) format = "webp";
    else if (fileUri.includes(".svg?")) format = "svg";
    else if (fileUri.includes(".ico?")) format = "ico";
    else if (fileUri.includes(".tiff?")) format = "tiff";
    else if (fileUri.includes(".tif?")) format = "tif";
    else if (fileUri.includes(".psd?")) format = "psd";
    else if (fileUri.includes(".raw?")) format = "raw";
    else if (fileUri.includes(".heif?")) format = "heif";
    else if (fileUri.includes(".indd?")) format = "indd";
    else if (fileUri.includes(".jpeg2000?")) format = "jpeg2000";
    else if (fileUri.includes(".exif?")) format = "exif";
    else if (fileUri.includes(".ppm?")) format = "ppm";
    else if (fileUri.includes(".pgm?")) format = "pgm";
    else if (fileUri.includes(".pbm?")) format = "pbm";
    else if (fileUri.includes(".pnm?")) format = "pnm";
    else if (fileUri.includes(".webp?")) format = "webp";
    else if (fileUri.includes(".heic?")) format = "heic";
    else if (fileUri.includes(".bat?")) format = "bat";
    else if (fileUri.includes(".cmd?")) format = "cmd";
    else if (fileUri.includes(".apk?")) format = "apk";
    else if (fileUri.includes(".app?")) format = "app";
    else if (fileUri.includes(".exe?")) format = "exe";
    else if (fileUri.includes(".ipa?")) format = "ipa";
    else if (fileUri.includes(".jar?")) format = "jar";
    else if (fileUri.includes(".msi?")) format = "msi";
    else if (fileUri.includes(".vb?")) format = "vb";
    else if (fileUri.includes(".vbs?")) format = "vbs";
    else if (fileUri.includes(".wsf?")) format = "wsf";
    else if (fileUri.includes(".3g2?")) format = "3g2";
    else if (fileUri.includes(".3gp?")) format = "3gp";
    else if (fileUri.includes(".avi?")) format = "avi";
    else if (fileUri.includes(".flv?")) format = "flv";
    else if (fileUri.includes(".h264?")) format = "h264";
    else if (fileUri.includes(".m4v?")) format = "m4v";
    else if (fileUri.includes(".mkv?")) format = "mkv";
    else if (fileUri.includes(".mov?")) format = "mov";
    else if (fileUri.includes(".mp4?")) format = "mp4";
    else if (fileUri.includes(".mpg?")) format = "mpg";
    else if (fileUri.includes(".mpeg?")) format = "mpeg";
    else format = "jpeg";

    const metadata = {
      type: "image/" + format,
    };

    const customFile = {
      uri: fileUri,
      name: `image.${format}`,
      type: `image/${format}`,
    };

    // Create the FormData object
    const formData = new FormData();
    formData.append("file", customFile);

    // The rest of your code...

    const storage = new Storage(client);
    const fileResponse = await storage.createFile(
      IMAGES_BUCKET_ID,
      fileUri,
      formData
    );
    console.log("File Response >>>> ", fileResponse);
    return fileResponse.$id;
  }

  const handleImage = async () => {
    setImageError((prev) => "");
    if (!hasGalleryPermissions) {
      setImageError((prev) => "*Please grant gallery access.");
    } else {
      if (images.length >= 3) {
        setImageError((prev) => "*Please select upto 3 images.");
        return;
      }
      await pickImage();
      console.log(image);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });
    console.log(result, "ASSETS >>>>>>>>>> ", result?.assets);
    if (!result.canceled) {
      if (!result?.selected) result = { selected: [result] };
      if (images.length === 0) {
        setImages((prev) => [
          ...prev,
          ...result?.selected
            ?.slice(0, 1 - images.length)
            .map((item) => item.assets[0]),
        ]);
        // setImageError((prev) => "*Please select upto 3 images.");
        return;
      }
      setImages((prev) => [...prev, ...result.selected.map((item) => item)]);
    }
  };

  console.log(images);

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermissions((prev) => galleryStatus.status === "granted");
    })();
  }, []);

  const handleCreateEvent = async () => {
    const token = AsyncStorage.getItem("token");
    console.log(token);
    setSigningin((prev) => true);
    setValidateMessage((prev) => null);
    if (!title) {
      setValidateMessage((prev) => "Please provide a title for your event.");
      setSigningin((prev) => false);
      return;
    }
    if (!description) {
      setValidateMessage(
        (prev) => "Please provide a description for your event."
      );
      setSigningin((prev) => false);
      return;
    }
    if (!privacy) {
      setValidateMessage((prev) => "Please provide a privacy for your event.");
      setSigningin((prev) => false);
      return;
    }
    if (!startDate) {
      setValidateMessage(
        (prev) => "Please provide a start date for your event."
      );
      setSigningin((prev) => false);
      return;
    }
    if (!startTime) {
      setValidateMessage(
        (prev) => "Please provide a start time for your event."
      );
      setSigningin((prev) => false);
      return;
    }
    if (!endDate) {
      setValidateMessage(
        (prev) => "Please provide an end date for your event."
      );
      setSigningin((prev) => false);
      return;
    }
    if (!endTime) {
      setValidateMessage(
        (prev) => "Please provide an end time for your event."
      );
      setSigningin((prev) => false);
      return;
    }
    if (!category) {
      setValidateMessage((prev) => "Please provide a category for your event.");
      setSigningin((prev) => false);
      return;
    }
    if (medium === "offline") {
      if (!location) {
        setValidateMessage(
          (prev) => "Please provide a location for your event."
        );
        setSigningin((prev) => false);
        return;
      }
      if (!latitude) {
        setValidateMessage(
          (prev) => "Please provide a latitude for your event."
        );
        setSigningin((prev) => false);
        return;
      }
      if (!longitude) {
        setValidateMessage(
          (prev) => "Please provide a longitude for your event."
        );
        setSigningin((prev) => false);
        return;
      }
    }
    if (medium === "online") {
      if (!meetLink) {
        setValidateMessage(
          (prev) => "Please provide a meeting link for your event."
        );
        setSigningin((prev) => false);
        return;
      }
      if (!meetId) {
        setValidateMessage(
          (prev) => "Please provide a meeting id for your event."
        );
        setSigningin((prev) => false);
        return;
      }
      if (!meetPassword) {
        setValidateMessage(
          (prev) => "Please provide a meeting password for your event."
        );
        setSigningin((prev) => false);
        return;
      }
    }
    // if (!images.length) {
    //   setValidateMessage(
    //     (prev) => "Please provide atleast one image for your event."
    //   );
    //   setSigningin((prev) => false);
    //   return;
    // }
    console.log({
      title,
      description,
      privacy,
      medium,
      startDate,
      startTime,
      endDate,
      endTime,
      category,
      location,
      latitude,
      longitude,
      meetLink,
      meetId,
      meetPassword,
      images,
      price,
    });
    setSigningin((prev) => false);
    try {
      const storage = new Storage(client);
      const fileId = await uploadImage(images[0].uri);
      console.log(fileId);
      const databases = new Databases(client);
      const response = await databases.createDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        title,
        {
          title,
          description,
          medium,
          startDate,
          startTime,
          endDate,
          endTime,
          category,
          location,
          latitude,
          longitude,
          meetLink,
          meetId,
          meetPassword,
          privacy,
          image: fileId,
          price,
        }
      );
      console.log(response);
      setToast((prev) => ({
        show: true,
        message: "Event created successfully!",
        type: "success",
      }));
      navigation.navigate("home");
    } catch (error) {
      console.log(error);
      setValidateMessage((prev) => error.message);
      setToast((prev) => ({
        show: true,
        message: "Something went wrong",
        type: "error",
      }));
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
      label: "Start Date",
      value: startDate,
      placeholder: "dd/mm/yyyy",
      cb: setStartDate,
      show: true,
      required: true,
    },
    {
      label: "Start Time",
      value: startTime,
      placeholder: "hh:mm (in 24 hour format)",
      cb: setStartTime,
      show: true,
      required: true,
    },
    {
      label: "End Date",
      value: endDate,
      placeholder: "dd/mm/yyyy",
      cb: setEndDate,
      show: true,
      required: true,
    },
    {
      label: "End Time",
      value: endTime,
      placeholder: "hh:mm (in 24 hour format)",
      cb: setEndTime,
      show: true,
      required: true,
    },
    {
      label: "Max Participants",
      value: maxParticipants,
      placeholder:
        "Please provide a maximum number of participants for your event.",
      cb: setMaxParticipants,
      inputMode: "numeric",
      show: true,
    },
    {
      label: "Price",
      value: price,
      placeholder: "Leave blank if it's a free event.",
      cb: setPrice,
      inputMode: "numeric",
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
      inputMode: "url",
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
      required: medium === "online",
    },
  ];

  //   const loginUser = async () => {
  //     setSigningin((prev) => true);
  //     setValidateMessage((prev) => null);
  //     console.log("Signing you up", email, password);

  //     const account = new Account(client);

  //     try {
  //       const loggedInResponse = await account.createEmailSession(
  //         email,
  //         password
  //       );
  //       console.log(loggedInResponse);
  //       AsyncStorage.setItem("token", JSON.stringify(loggedInResponse));
  //       setToast((prev) => ({
  //         show: true,
  //         message: "Logged in successfully",
  //         type: "success",
  //       }));
  //       const accountDetails = await account.get();
  //       console.log(accountDetails);
  //       if (accountDetails.phoneVerification)
  //         router.replace({ pathname: "/main/home" });
  //       else if (
  //         accountDetails.phone.length === 0 ||
  //         accountDetails.phone === null ||
  //         accountDetails.phone === undefined
  //       )
  //         router.replace({
  //           pathname: "/splash/phone",
  //           params: { ...loggedInResponse, email, password },
  //         });
  //       else {
  //         const sendOTPResponse = await account.createPhoneVerification();
  //         console.log(sendOTPResponse);
  //         setToast((prev) => ({
  //           show: true,
  //           message: "Please Verify your phone number. OTP sent successfully.",
  //           type: "success",
  //         }));
  //         router.replace({
  //           pathname: "/splash/otp",
  //           params: {
  //             ...sendOTPResponse,
  //             email,
  //             password,
  //             phone: accountDetails.phone,
  //           },
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error, error.message);
  //       setValidateMessage((prev) => error.message);
  //     } finally {
  //       setSigningin((prev) => false);
  //     }
  //   };

  return {
    inputs,
    validateMessage,
    signingin,
    setSigningin,
    setValidateMessage,
    images,
    setImages,
    imageError,
    setImageError,
    pickImage,
    handleImage,
    handleCreateEvent,
  };
}
export default createEventLogic;
