import { useRef } from "react";
import { Link } from "react-router-dom";

import Marketing from "../../assets/images/marketing.png";
import Research from "../../assets/images/research.png";
import Development from "../../assets/images/dev.png";
import Ui from "../../assets/images/uiux.png";
import Card from "../../components/Card";
import Testimonial from "../../components/TestimonialCard";
import Hero from "../../assets/images/pattern1.jpg";
import { Navigation, Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { IoArrowBack, IoArrowForward, IoCreateOutline, IoPeople, IoPeopleOutline, IoTicketOutline } from "react-icons/io5";
import { MdManageHistory, MdOutlinePrivacyTip, MdRsvp } from "react-icons/md";
import { RiSteamLine } from "react-icons/ri";

const data = [
  {
    title: "Event Creation Made Easy",
    description:
      "Seamlessly create and manage events with our intuitive event creation feature. Specify event details, such as date, time, location, and description, to provide a clear picture for your attendees. Customize event settings, add event images, and set ticket options effortlessly.",
    icon: <IoCreateOutline />,
  },
  {
    title: "Flexible Event Privacy",
    description:
      "Take control over event visibility with our private and public event options. Host private gatherings with exclusive access for selected participants or organize public events to reach a wider audience. Customize privacy settings to suit the unique needs of each event.",
    icon: <MdOutlinePrivacyTip />,
  },
  {
    title: "Seamless User Invitations",
    description:
      "Invite participants effortlessly by sending invitation links directly through our app. Share invitation links via email, messaging apps, or social media platforms. Ensure a smooth registration process and track attendee responses for effective event management.",
    icon: <IoTicketOutline />,
  },
  {
    title: "Easy Attendee Management",
    description:
      "Keep track of attendees and their details with our comprehensive attendee management feature. Easily view and manage RSVPs, track attendance, and collect essential participant information.",
    icon: <IoPeopleOutline />,
  },
];

const data2 = [
  {
    num: "300+",
    title: "Lorem Ipsum",
  },
  {
    num: "300+",
    title: "Lorem Ipsum",
  },
  {
    num: "300+",
    title: "Lorem Ipsum",
  },
  {
    num: "300+",
    title: "Lorem Ipsum",
  },
];

const testimonialData = [
  {
    name: "John Doe",
    title: "CEO",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    photo: "https://i.pravatar.cc/300",
  },
  {
    name: "John Doe",
    title: "CEO",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    photo: "https://i.pravatar.cc/300",
  },
  {
    name: "John Doe",
    title: "CEO",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    photo: "https://i.pravatar.cc/300",
  },
  {
    name: "John Doe",
    title: "CEO",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    photo: "https://i.pravatar.cc/300",
  },
  {
    name: "John Doe",
    title: "CEO",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    photo: "https://i.pravatar.cc/300",
  },
  {
    name: "John Doe",
    title: "CEO",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    photo: "https://i.pravatar.cc/300",
  },
  {
    name: "John Doe",
    title: "CEO",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    photo: "https://i.pravatar.cc/300",
  },
  {
    name: "John Doe",
    title: "CEO",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    photo: "https://i.pravatar.cc/300",
  },
];

function Landing() {
  const swiper = useSwiper();
  const swiperRef = useRef(null);

  return (
    <div className="flex-1 bg-white font-poppins select-none">
      <div className="bg-secondary">
        <section className="flex flex-col text-center w-full items-center py-8 lg:py-16 justify-center gap-8 md:gap-0 container min-h-[83vh] md:min-h-[89vh] relative">
          {/* <img className="absolute w-full h-full object-cover z-0 mix-blend-multiply opacity-50" src={Hero}/> */}
          <div
            className="flex flex-col gap-4 items-center justify-center z-10"
            style={{ flexBasis: "50%" }}
          >
            <h1 className="text-4xl lg:text-6xl text-slate-100 font-bold leading-relaxed lg:leading-normal drop-shadow-xl">
              Manage and plan events like drinking water
            </h1>
            <p className="  md:max-w-[90%] py-4 text-slate-400">
              Create and manage events with ease. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
            <Link
              to={"/"}
              className="bg-gradient-to-r from-accent to-accent rounded-full p-4 text-white text-center"
            >
              Get Started
            </Link>
          </div>
          <div className=" w-full relative">
            {/* <img
                draggable={false}
                className="m-auto p-4 md:p-6 mix-blend-lighten z-10 w-full"
                src={Hero}
              /> */}
          </div>
        </section>
      </div>
      <section className="flex flex-col-reverse  lg:flex-row w-full py-8 md:py-16 justify-between gap-8 md:gap-0 container">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{ flexBasis: "50%" }}
        >
          {/* {data.map((item) => (
            <Card {...item} />
          ))} */}
        </div>
        <div
          className="flex flex-col gap-4 items-start justify-evenly text-left py-8 lg:pl-16"
          style={{ flexBasis: "50%" }}
        >
          <p className="text-accent tracking-[1px] font-semibold items-center gap-2 flex">
            <hr className="w-20 h-1 bg-accent"></hr>
          </p>
          <h1 className="text-3xl md:text-5xl text-primary font-semibold md:leading-normal">
            Streamline Your Event Planning
          </h1>
          <hr className="w-full border border-neutral-200"></hr>
          <p className="text-sm leading-[1.4rem] md:max-w-[90%] py-4 text-neutral-500 text-justify">
            Say goodbye to the chaos of event planning. Our web app provides you
            with a centralized platform to manage all aspects of your events.
            From initial brainstorming to final execution, our intuitive
            interface makes it easy to stay organized and collaborate seamlessly
            with your team.
          </p>
          <Link
            to={"/"}
            className="bg-accent rounded-full p-4 text-white text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
      <div className="bg-gradient-to-b from-secondary from-100% to-50% to-white pb-10">
        <section className="flex flex-col lg:flex-row w-full items-center py-8 lg:pt-16 lg:pb-0 justify-between gap-4 md:gap-0 container">
          <div className="flex flex-row gap-16">
            <div className="flex-[80%] space-y-4">
              <p className="text-accent tracking-[1px] font-semibold  items-center gap-2 flex">
                <div className="w-20 h-1 bg-accent"></div> Secure
              </p>
              <h1 className="text-3xl md:text-5xl text-white font-semibold md:leading-normal">
                Security and Reliability
              </h1>
            </div>
          </div>
          <p className="flex-[80%] w-full text-sm leading-[1.4rem] md:max-w-[90%] py-4 text-slate-400 text-justify">
            Rest assured that your event data is safe and secure with our web
            app. We prioritize data protection and employ industry-standard
            security measures to safeguard your information. Our reliable
            infrastructure ensures that your event management process remains
            uninterrupted, allowing you to focus on what matters most – creating
            exceptional events.
          </p>
        </section>
        <div className="flex flex-row gap-4 items-center justify-between container">
          <hr className="w-full  border border-neutral-200 opacity-30"></hr>
          <div className="inline-flex flex-[50%] gap-4 justify-end items-center">
            <button
              onClick={() => {
                swiperRef.current.swiper.slidePrev();
              }}
              className="text-white p-4 rounded-full outline outline-1 outline-white hover:bg-primary hover:outline-none transition-all"
            >
              <IoArrowBack />
            </button>
            <button
              onClick={() => {
                swiperRef.current.swiper.slideNext();
              }}
              className="text-white p-4 rounded-full bg-accent"
            >
              <IoArrowForward />
            </button>
          </div>
        </div>
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={50}
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 50,
            },
            820: {
              slidesPerView: 2.5,
              spaceBetween: 50,
            },
            960: {
              slidesPerView: 2.8,
              spaceBetween: 50,
            },
            1024: {
              slidesPerView: 2.5,
              spaceBetween: 80,
            },
          }}
        >
          {data.map((item) => (
            <SwiperSlide>
              <Card {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* <div className="bg-secondary py-20 ">
        <section className="container flex flex-col lg:flex-row gap-8 text-white justify-around items-center">
          {data2.map((item, index) => (
            <>
              <div className="text-center flex flex-col gap-4 hover:text-accent">
                <h4 className="text-5xl font-semibold">{item.num}</h4>
                <span>{item.title}</span>
              </div>
              {index < data2.length - 1 && (
                <hr className="w-full h-[1px] lg:w-[1px] lg:h-20 bg-neutral-100 opacity-30"></hr>
              )}
            </>
          ))}
        </section>
      </div> */}
      <section className="flex flex-col-reverse lg:flex-row-reverse w-full py-8 md:py-16 justify-between gap-8 md:gap-0 container">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{ flexBasis: "50%" }}
        >
          {/* {data.map((item) => (
            <Card {...item} />
          ))} */}
        </div>
        <div
          className="flex flex-col gap-4 items-start justify-evenly text-left py-8 lg:pr-16"
          style={{ flexBasis: "50%" }}
        >
          <p className="text-accent tracking-[1px] font-semibold items-center gap-2 flex">
            <hr className="w-20 h-1 bg-accent"></hr> Registrations Made Easy
          </p>
          <h1 className="text-3xl md:text-5xl text-primary font-semibold md:leading-normal">
            Effortless Event Registration
          </h1>
          <hr className="w-full border border-neutral-200"></hr>
          <p className="text-sm leading-[1.4rem] md:max-w-[90%] py-4 text-neutral-500 text-justify">
            With our Event Management Web App, event registration becomes a
            breeze. Invite attendees with just a click, monitor registrations,
            send out automated confirmations, and track attendance all from one
            convenient location.
          </p>
          <Link
            to={"/"}
            className="bg-gradient-to-r from-primary to-primary rounded-full px-6 p-4 text-white text-center"
          >
            Get Started
          </Link>
        </div>
      </section>
      
      {/* <section className="container py-16">
        <h2 className="font-bold text-3xl md:text-4xl lg:text-6xl leading-normal text-primary testimonial-title">
          Beloved by so many people worldwide
        </h2>
        <Swiper
          className="w-full testimonial-slider"
          modules={[Pagination, Autoplay]}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 50,
            },
            820: {
              slidesPerView: 2,
            },
            960: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonialData.map((item) => (
            <SwiperSlide className="w-full">
              <Testimonial {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section> */}
    </div>
  );
}

export default Landing;
