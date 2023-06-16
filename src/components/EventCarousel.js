import React, { useRef } from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ExploreEventCard from "./ExploreEventCard";

function EventCarousel({ events, title }) {
  const swiperRef = useRef(null);
  
  
  

  return (
    <div>
      <div className="inline-flex items-center w-full justify-between">
        <h1 className="page-title">{title} Events</h1>
        <div className="inline-flex text-primary gap-4 justify-end items-center">
          <button
            onClick={() => {
              swiperRef.current.swiper.slidePrev();
            }}
          >
            <IoArrowBack />
          </button>
          <button
            onClick={() => {
              swiperRef.current.swiper.slideNext();
            }}
          >
            <IoArrowForward />
          </button>
        </div>
      </div>
      <div>
        <Swiper
          className="event-swiper"
          ref={swiperRef}
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            360: {
                slidesPerView: 1,
            },
            560: {
                slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
            },
            820: {
              slidesPerView: 4,
            }
          }}
        >
          {events?.map((item) => (
            <SwiperSlide>
              <ExploreEventCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default EventCarousel;
