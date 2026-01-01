import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function CarImageCarousel({ images }) {
  return (
    <Carousel
      showThumbs={false}      // hide small thumbnails
      showStatus={false}      // hide current slide number
      infiniteLoop            // loop slides infinitely
      autoPlay                // automatically move slides
      interval={3000}         // slide every 3 seconds
      stopOnHover={true}      // pause when hovering
      swipeable={true}        // allow swipe on mobile
    >
      {images.map((img, index) => (
        <div key={index}>
          <img src={img} alt={`Car ${index + 1}`} />
        </div>
      ))}
    </Carousel>
  );
}

export default CarImageCarousel;
