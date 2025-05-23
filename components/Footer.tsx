"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
const Footer: React.FC = () => {
  return (
    <footer className="border-t px-10 py-5 bg-[#2B2A34] text-white">
      <div className="flex flex-col  justify-between ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-white">
                 <img
                                   width={100}
                                       height={100}
                                       src="/placeholder.svg"
                                       alt="InvoiceExtract Logo"
                                       className="h-full w-full object-contain"
                                     />  
                       
              </div>
              <span className="font-bold text-xl">InvoiceAI</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Extract data from your invoices effortlessly with our AI-powered platform. 
              Save time and automate your document processing workflow.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} InvoiceAI. All rights reserved.
          </p>
        {/* <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} InvoiceAI. All rights reserved.
          </p>
          <div className="flex space-x-6">
             social links... (no change needed here) 
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;