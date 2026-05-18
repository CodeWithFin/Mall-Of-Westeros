import Link from "next/link";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

const linkSections = [
  { title: "PRODUCTS", links: [
      { text: "Phones", path: "/products?category=phone" },
      { text: "Laptops", path: "/products?category=laptop" },
      { text: "All Products", path: "/products" },
  ]},
  { title: "ACCOUNT", links: [
      { text: "Login", path: "/login" },
      { text: "Register", path: "/register" },
      { text: "My Orders", path: "/account" },
  ]},
  { title: "CONTACT", links: [
      { text: "support@mallofwesteros.com", path: "mailto:support@mallofwesteros.com" },
      { text: "+254 700 000 000", path: "tel:+254700000000" },
      { text: "Nairobi, Kenya", path: "#" },
  ]},
];

export default function Footer() {
  return (
    <footer className="mx-6 bg-white mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-slate-500/30 text-slate-500">
          <div>
            <Link href="/" className="text-4xl font-semibold text-slate-700">
              <span className="text-green-600">mall</span>ow<span className="text-green-600 text-5xl leading-0">.</span>
            </Link>
            <p className="max-w-[410px] mt-6 text-sm">{APP_DESCRIPTION}. Authentic products, competitive prices, fast delivery.</p>
          </div>

          <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5 text-sm">
            {linkSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-medium text-slate-700 md:mb-5 mb-3">{section.title}</h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link href={link.path} className="hover:underline transition">{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
        <p className="py-4 text-sm text-slate-500">Copyright 2026 © {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
