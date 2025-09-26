'use client'
import CounterItem from '@/components/pageComponents/Counter/CounterItem'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function AboutPage() {
  return (
    <>
      <section
        className="relative mt-[100px] w-full h-[450px] flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: "url('/assets/hero-image.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 text-center bg-black opacity-10 z-10 py" />
        <div className="max-w-3xl mx-auto">
          <h1 className="relative z-20 text-white text-5xl font-bold mt-20">
            Our Story of Fresh & Organic
          </h1>
          <p className="relative z-20 text-white text-lg mt-5">
            From farm to table, we&apos;re committed to bringing you the finest organic products
            while supporting sustainable farming practices and local communities.
          </p>
        </div>
      </section>
      <div className="py-32 container mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <h3 className="font-extrabold text-3xl my-4">Growing Since 2020</h3>
            <p className="text-[#1A1A1AB2] my-2 text-lg">
              What started as a small family farm in Abuja has grown into Nigeria&apos;s most
              trusted organic food retailer. We believe that everyone deserves access to fresh,
              healthy and sustainably grown food.
            </p>
            <p className="text-[#1A1A1AB2] my-2 text-lg">
              Our journey began when our founder Lorem Ipsum, noticed the lack of truly organic
              options in local markets. Today, we work directly with over 50 certified organic farms
              across Nigeria, ensuring quality from seed to shelf.
            </p>
            <div className="py-3">
              <div className="flex justify-center px-3 py-6 rounded-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl text-black">
                  <CounterItem end={5} label={`Years Experience`} symbol="+" />
                  <CounterItem end={50} label={`Partner Farms`} symbol="+" />
                  <CounterItem end={10} label={`Happy Customers`} symbol="K+" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/assets/farmer.png"
              alt="farmer-img"
              width={500}
              height={300}
              className=""
            />
          </div>
        </div>
      </div>
      <section className="bg-[#F0F0F0]">
        <div className="py-24 container mx-auto ">
          <h3 className="font-extrabold text-center text-4xl my-4">Our Core Values</h3>
          <p className="text-lg text-center my-2">
            These principles guide everything we do from selecting partners to serving customers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl text-black my-14">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <span className="my-2  text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="72"
                  height="72"
                  fill="currentColor"
                >
                  <path d="M9.3349 11.5022L11.5049 11.5027C13.9902 11.5027 16.0049 13.5174 16.0049 16.0027L9.00388 16.0018L9.00488 17.0027L17.0049 17.0019V16.0027C17.0049 14.9202 16.6867 13.8996 16.1188 13.0019L19.0049 13.0027C20.9972 13.0027 22.7173 14.1679 23.521 15.8541C21.1562 18.9747 17.3268 21.0027 13.0049 21.0027C10.2436 21.0027 7.90437 20.4121 6.00447 19.3779L6.00592 10.0737C7.25147 10.2521 8.39122 10.7583 9.3349 11.5022ZM4.00488 9.00268C4.51772 9.00268 4.94039 9.38872 4.99816 9.88606L5.00488 10.0018V19.0027C5.00488 19.555 4.55717 20.0027 4.00488 20.0027H2.00488C1.4526 20.0027 1.00488 19.555 1.00488 19.0027V10.0027C1.00488 9.45039 1.4526 9.00268 2.00488 9.00268H4.00488ZM13.6513 3.57806L14.0046 3.93183L14.3584 3.57806C15.3347 2.60175 16.9177 2.60175 17.894 3.57806C18.8703 4.55437 18.8703 6.13728 17.894 7.11359L14.0049 11.0027L10.1158 7.11359C9.13948 6.13728 9.13948 4.55437 10.1158 3.57806C11.0921 2.60175 12.675 2.60175 13.6513 3.57806Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Sustainability</h3>
              <p className="text-[#1A1A1AB2] text-lg">
                We practice and promote sustainable farming methods that protect our environment for
                future generations.
              </p>
            </div>
            {/* second card */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <span className="my-2 text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="72"
                  height="72"
                  fill="currentColor"
                >
                  <path d="M12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598L12 1ZM16.4524 8.22183L11.5019 13.1709L8.67421 10.3431L7.25999 11.7574L11.5026 16L17.8666 9.63604L16.4524 8.22183Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Quality First</h3>
              <p className="text-[#1A1A1AB2] text-lg">
                Every product is carefully selected and tested to meet our strict quality standards
                before reaching you.
              </p>
            </div>
            {/* third card */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <span className="my-2 text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="72"
                  height="72"
                  fill="currentColor"
                >
                  <path d="M5.23379 7.72989C6.65303 5.48625 9.15342 4 12.0002 4C14.847 4 17.3474 5.48625 18.7667 7.72989L20.4569 6.66071C18.6865 3.86199 15.5612 2 12.0002 2C8.43928 2 5.31393 3.86199 3.54356 6.66071L5.23379 7.72989ZM12.0002 20C9.15342 20 6.65303 18.5138 5.23379 16.2701L3.54356 17.3393C5.31393 20.138 8.43928 22 12.0002 22C15.5612 22 18.6865 20.138 20.4569 17.3393L18.7667 16.2701C17.3474 18.5138 14.847 20 12.0002 20ZM12 8C12.5523 8 13 8.44772 13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8ZM12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12ZM12 15C10.8954 15 10 15.8954 10 17H8C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17H14C14 15.8954 13.1046 15 12 15ZM3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13C3.55228 13 4 12.5523 4 12C4 11.4477 3.55228 11 3 11ZM0 12C0 10.3431 1.34315 9 3 9C4.65685 9 6 10.3431 6 12C6 13.6569 4.65685 15 3 15C1.34315 15 0 13.6569 0 12ZM20 12C20 11.4477 20.4477 11 21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12ZM21 9C19.3431 9 18 10.3431 18 12C18 13.6569 19.3431 15 21 15C22.6569 15 24 13.6569 24 12C24 10.3431 22.6569 9 21 9Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Community</h3>
              <p className="text-[#1A1A1AB2] text-lg">
                We support local farmers and communities, creating a network of sustainable
                agricultural practices.
              </p>
            </div>
            {/* fourth card */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <span className="my-2 text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="72"
                  height="72"
                  fill="currentColor"
                >
                  <path d="M14.1213 10.4792C13.7308 10.0886 13.0976 10.0886 12.7071 10.4792L12 11.1863C11.2189 11.9673 9.95259 11.9673 9.17154 11.1863C8.39049 10.4052 8.39049 9.13888 9.17154 8.35783L14.8022 2.72568C16.9061 2.24973 19.2008 2.83075 20.8388 4.46875C23.2582 6.88811 23.3716 10.7402 21.1792 13.2939L19.071 15.4289L14.1213 10.4792ZM3.16113 4.46875C5.33452 2.29536 8.66411 1.98283 11.17 3.53116L7.75732 6.94362C6.19523 8.50572 6.19523 11.0384 7.75732 12.6005C9.27209 14.1152 11.6995 14.1611 13.2695 12.7382L13.4142 12.6005L17.6568 16.8431L13.4142 21.0858C12.6331 21.8668 11.3668 21.8668 10.5858 21.0858L3.16113 13.6611C0.622722 11.1227 0.622722 7.00715 3.16113 4.46875Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Transparency</h3>
              <p className="text-[#1A1A1AB2] text-lg">
                We believe in complete transparency about our sourcing farming practices and product
                origins.
              </p>
            </div>
            {/* fifth card */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <span className="my-2 text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="72"
                  height="72"
                  fill="currentColor"
                >
                  <path d="M17 8H20L23 12.0557V18H20.9646C20.7219 19.6961 19.2632 21 17.5 21C15.7368 21 14.2781 19.6961 14.0354 18H8.96456C8.72194 19.6961 7.26324 21 5.5 21C3.73676 21 2.27806 19.6961 2.03544 18H1V6C1 5.44772 1.44772 5 2 5H16C16.5523 5 17 5.44772 17 6V8ZM17 10V13H21V12.715L18.9917 10H17Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Fresh Delivery</h3>
              <p className="text-[#1A1A1AB2] text-lg">
                Our efficient cold-chain delivery ensures products reach you at peak freshness and
                nutritional value.
              </p>
            </div>
            {/* sixth card */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <span className="my-2 text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="72"
                  height="72"
                  fill="currentColor"
                >
                  <path d="M21 8C22.1046 8 23 8.89543 23 10V14C23 15.1046 22.1046 16 21 16H19.9381C19.446 19.9463 16.0796 23 12 23V21C15.3137 21 18 18.3137 18 15V9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V16H3C1.89543 16 1 15.1046 1 14V10C1 8.89543 1.89543 8 3 8H4.06189C4.55399 4.05369 7.92038 1 12 1C16.0796 1 19.446 4.05369 19.9381 8H21ZM7.75944 15.7849L8.81958 14.0887C9.74161 14.6662 10.8318 15 12 15C13.1682 15 14.2584 14.6662 15.1804 14.0887L16.2406 15.7849C15.0112 16.5549 13.5576 17 12 17C10.4424 17 8.98882 16.5549 7.75944 15.7849Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Customer Care</h3>
              <p className="text-[#1A1A1AB2] text-lg">
                We are committed to providing exceptional service and support to every customer,
                every time.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#084710]">
        <div className="py-32 container mx-auto ">
          <h3 className="font-extrabold text-center text-white text-4xl my-4">
            Our Certifications
          </h3>
          <p className="text-lg text-white text-center my-2">
            We maintain the highest standards through rigorous certification and quality assurance
            programs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl text-black my-14">
            <div className="bg-white text-center p-4 rounded-xl shadow-md">
              <span className="my-2 flex justify-center  text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="currentColor"
                >
                  <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Organic Certified</h3>
              <p className="text-[#1A1A1AB2] text-lg">IFOAM certified organic standards.</p>
            </div>
            {/* second card */}
            <div className="bg-white text-center p-4 rounded-xl shadow-md">
              <span className="my-2 flex justify-center  text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="currentColor"
                >
                  <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Food Safety</h3>
              <p className="text-[#1A1A1AB2] text-lg">HACCP compliant processes.</p>
            </div>
            {/* third card */}
            <div className="bg-white text-center p-4 rounded-xl shadow-md">
              <span className="my-2 flex justify-center  text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="currentColor"
                >
                  <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Sustainable</h3>
              <p className="text-[#1A1A1AB2] text-lg">Rainforest Alliance certified..</p>
            </div>
            {/* fourth card */}
            <div className="bg-white text-center p-4 rounded-xl shadow-md">
              <span className="my-2 flex justify-center  text-[#084710]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="currentColor"
                >
                  <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                </svg>
              </span>
              <h3 className="text-[#084710] font-semibold text-xl my-4">Fair Trade</h3>
              <p className="text-[#1A1A1AB2] text-lg">Supporting fair farmer wages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* quality assurance */}
      <section className="bg-[#F0F0F0] py-32">
        <div className=" container mx-auto py-16 bg-white shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <h3 className="font-extrabold text-3xl my-4">Quality Assurance Process</h3>
              <div className="my-8">
                <p className="text-black font-semibold my-2 text-xl">Farm Inspection</p>
                <p className="text-[#1A1A1AB2] my-2 text-lg">
                  Regular on-site visits to verify organic practices.
                </p>
              </div>
              <div className="my-8">
                <p className="text-black font-semibold my-2 text-xl">Testing & Analysis</p>
                <p className="text-[#1A1A1AB2] my-2 text-lg">
                  Regular on-site visits to verify organic practices.
                </p>
              </div>
              <div className="my-8">
                <p className="text-black font-semibold my-2 text-xl">Cold Chain Management</p>
                <p className="text-[#1A1A1AB2] my-2 text-lg">
                  Temperature-controlled storage and delivery.
                </p>
              </div>
              <div className="my-8">
                <p className="text-black font-semibold my-2 text-xl">Final Quality Check</p>
                <p className="text-[#1A1A1AB2] my-2 text-lg">
                  Pre-delivery inspection of all orders.
                </p>
              </div>
            </div>
            <div>
              <Image
                src="/assets/seasonal-farm.jpg"
                alt="farmer-img"
                width={500}
                height={500}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}