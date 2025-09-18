"use client";
import React, { useState } from "react";
import Script from "next/script";
import { createOrder } from "@/lib/api";

// Helper component for roadmap items
const RoadmapItem = ({ title, description, status }) => {
  const statusClasses = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    inProgress:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    planned:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  };
  return (
    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">
          {title}
        </h3>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}
        >
          {status.replace(/([A-Z])/g, " $1").trim()}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default function DonatePage() {
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const handlePayment = async (amount) => {
    // Validate custom amount
    if (amount < 1) {
      //edit
      alert("Custom amount must be at least ₹300.");
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder(amount);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR", // Set currency to INR
        name: "QuranAudio.in",
        description: "Donation for QuranAudio Project",
        order_id: order.id,
        handler: function (response) {
          alert("Payment successful! JazakAllah Khair for your support.");
        },
        prefill: {
          name: "Your Name",
          email: "your.email@example.com",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
    setLoading(false);
  };
  return (
    <div className="max-w-4xl mx-auto">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-green-600 dark:text-green-500">
          Support QuranAudio.in
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-balance">
          Our mission is to provide a beautiful, ad-free, and accessible Quran
          listening experience for everyone. Your contribution helps us cover
          our operational costs and build new features to serve the Ummah.
        </p>
      </header>

      <section id="donate-options" className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">
          Choose Your Support
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <button
            onClick={() => handlePayment(1)} //edit
            disabled={loading}
            className="p-6 bg-green-600 text-white rounded-lg font-bold text-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            ₹100
          </button>
          <button
            onClick={() => handlePayment(250)}
            disabled={loading}
            className="p-6 bg-green-600 text-white rounded-lg font-bold text-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            ₹250
          </button>
          <button
            onClick={() => handlePayment(500)}
            disabled={loading}
            className="p-6 bg-green-600 text-white rounded-lg font-bold text-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            ₹500
          </button>
        </div>
        <div className="flex justify-center items-center gap-4">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Custom Amount (min ₹100)"
            className="p-4 border rounded-lg w-full max-w-xs text-center"
          />
          <button
            onClick={() => handlePayment(Number(customAmount))}
            disabled={loading || Number(customAmount) < 1} //edit
            className="p-4 bg-gray-700 text-white rounded-lg font-bold text-xl hover:bg-gray-600 transition disabled:opacity-50"
          >
            Donate
          </button>
        </div>
      </section>

      <section id="roadmap">
        <h2 className="text-2xl font-bold text-center mb-6">Our Roadmap</h2>
        <div className="space-y-4">
          <RoadmapItem
            title="Verse-by-Verse Recitation"
            description="Listen to individual verses, making it easier to memorize and reflect."
            status="completed"
          />
          <RoadmapItem
            title="Tafsir Audio Integration"
            description="Audio explanations for each Surah to deepen understanding."
            status="completed"
          />
          <RoadmapItem
            title="User Accounts & Bookmarking"
            description="Create an account to save your favorite reciters, and bookmark your progress."
            status="inProgress"
          />
          <RoadmapItem
            title="Verse-by-Verse Translation & Tafsir"
            description="Read and listen to translations and tafsir for each verse."
            status="planned"
          />
          <RoadmapItem
            title="Mobile Apps (iOS & Android)"
            description="Dedicated apps for a seamless experience on your mobile devices."
            status="planned"
          />
          <RoadmapItem
            title="Offline Listening"
            description="Download Surahs to listen without an internet connection."
            status="planned"
          />
        </div>
      </section>
    </div>
  );
}
