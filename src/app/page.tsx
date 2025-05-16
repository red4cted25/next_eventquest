import Image from "next/image";
import { FaCalendarDay, FaLocationArrow, FaSistrix } from "react-icons/fa6";


export default function Home() {

  return (
    <>
      {/* Search */}
      <section className="flex flex-col">
        <div>
          <div>
            <FaCalendarDay />
            <p>City or Zip Code</p>
          </div>
          <div>
            <FaLocationArrow />
            <p>All Dates</p>
          </div>
        </div>
        <div className="border-t-2 py-2">
          <div className="border-2 flex">
            <input type="text" name="" id="" />
            <FaSistrix />
          </div>
        </div>
      </section>
      {/* Hero */}
      <section className="flex flex-col">
        <h1>A Night of Fun</h1>
        <div className="flex">
          <button type="button" className="text-white bg-azure rounded-md hover:bg-sapphire">Learn More</button>
          <button type="button" className="text-white bg-azure rounded-md hover:bg-sapphire">Buy Tickets</button>
        </div>
      </section>
      {/* Featured Events */}
      
    </>
  );
}
