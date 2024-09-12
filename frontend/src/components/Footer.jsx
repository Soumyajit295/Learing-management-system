import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm sm:text-base">
          © {new Date().getFullYear()} My Blog. All rights reserved.
        </p>
        <p className="text-sm sm:text-base mt-2">
           Soumyajit
        </p>
      </div>
    </footer>
  );
};

export default Footer;
