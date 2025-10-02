'use client'
import CounterItem from '@/components/pageComponents/Counter/CounterItem'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function AboutPage() {
  return (
    <>
      <section
        className="relative mt-[100px] w-full h-[450px] flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: "url('/assets/contact-hero-img.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 text-center bg-black opacity-30 z-10" />
        <div className="max-w-3xl mx-auto">
          <h1 className="relative z-20 text-white text-5xl font-bold mt-20">Get In Touch</h1>
          <p className="relative z-20 text-white text-lg mt-5">
            Have questions about our products or services? We&apos;re here to help! Reach out to our
            friendly customer service team.
          </p>
        </div>
      </section>
      <div className=" bg-[#F0F0F0]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-white py-24 px-24">
            <form>
              <h3 className="text-3xl font-bold py-2">Send us a Message</h3>
              <p className="text-[#1A1A1A99] text-md py-2">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
              <div className="my-4">
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full-name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="my-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="my-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="my-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="my-4">
                <Button
                  type="submit"
                  className="flex gap-4 items-center bg-[#084710] text-white text-lg px-6 py-2 rounded-3xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span> Submit </span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="rgba(255,255,255,1)"
                    >
                      <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path>
                    </svg>
                  </span>
                </Button>
              </div>
            </form>
          </div>
          <div className="bg-[#F0F0F0] py-24 px-24">
            <h3 className="text-3xl font-bold py-2">Contact Information</h3>
            <p className="text-[#1A1A1A99] text-md py-2 my-4">
              Choose the most convenient way to reach us. We&apos;re here to help!
            </p>
            <div className="flex flex-col gap-6">
              <div className="p-3 flex gap-6 bg-white border border-[#084710] rounded-2xl">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-phone-call-icon lucide-phone-call"
                  >
                    <path d="M13 2a9 9 0 0 1 9 9" />
                    <path d="M13 6a5 5 0 0 1 5 5" />
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                  </svg>
                </span>{' '}
                <div className="flex flex-col gap-1">
                  <p className="text-black font-semibold text-md">Call Us</p>
                  <p className="text-black text-md">+2341245678</p>
                  <p className="text-[#1A1A1A99] text-md">Mon - Fri (9AM - 6PM), Sat (9AM - 2PM)</p>
                </div>
              </div>
              {/* second item */}
              <div className="p-3 flex gap-6 bg-white border border-[#084710] rounded-2xl">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-mail-icon lucide-mail"
                  >
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                  </svg>
                </span>{' '}
                <div className="flex flex-col gap-1">
                  <p className="text-black font-semibold text-md">Email Us</p>
                  <p className="text-black text-md">hello@chiksblessing.com</p>
                  <p className="text-[#1A1A1A99] text-md">We reply within 24 hours</p>
                </div>
              </div>
              {/* third item */}
              <div className="p-3 flex gap-6 bg-white border border-[#084710] rounded-2xl">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"></path>
                  </svg>
                </span>{' '}
                <div className="flex flex-col gap-1">
                  <p className="text-black font-semibold text-md">Whatsapp</p>
                  <p className="text-black text-md">+23412345678</p>
                  <p className="text-[#1A1A1A99] text-md">Quick support via whatsapp</p>
                </div>
              </div>
              {/* fourth item */}
              <div className="p-3 flex gap-6 bg-white border border-[#084710] rounded-2xl">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-map-pin-icon lucide-map-pin"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>{' '}
                <div className="flex flex-col gap-1">
                  <p className="text-black font-semibold text-md">Visit Us</p>
                  <p className="text-black text-md">Kubwa street</p>
                  <p className="text-[#1A1A1A99] text-md">Abuja, Nigeria</p>
                </div>
              </div>
              {/* fifth item */}
              <div className="p-3 flex gap-6 bg-white border border-[#084710] rounded-2xl">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
                  </svg>
                </span>{' '}
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-black font-semibold text-md">Business hours</p>
                  <div className="flex flex-col gap-4 divide-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-[#1A1A1A99] text-md">Monday - Friday</div>
                      <div className="text-black text-md">9:00 AM - 6:00 PM</div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-[#1A1A1A99] text-md">Saturday</div>
                      <div className="text-black text-md">9:00 AM - 6:00 PM</div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-[#1A1A1A99] text-md">Sunday</div>
                      <div className="text-black text-md">Closed</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* sixth item */}
            </div>
          </div>
        </div>
        {/* location map */}
        <div className="bg-[#F0F0F0]">
          <div className="py-24 text-center container mx-auto">
            <h3 className="text-3xl font-semibold my-4">Find Us</h3>
            <p className="text-lg text-[#1A1A1A99] my-4">
              Visit our main office and warehouse facility in Abuja. We welcome customers to see our
              operations and quality standards firsthand.
            </p>
            <div>
              <iframe
                title="Chiks Blessing Global Abuja Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.996532205349!2d7.4223376000000005!3d9.064079200000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e7575bb572177%3A0xd72ce2d378573b4!2sCubeHub%20-%20Coworking%2C%20Virtual%20and%20Serviced%20Offices%20-%20Jabi%20Centre%2C%20Abuja!5e0!3m2!1sen!2sng!4v1755831224415!5m2!1sen!2sng"
                width="100%"
                height="620"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}