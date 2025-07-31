import Image from "next/image";
import { Link } from "next-view-transitions";

const footerData = {
  discover: {
    title: "Discover",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "About", href: "/about" },
      { label: "Instagram", href: "/instagram" },
    ],
  },
  concierge: {
    title: "Concierge",
    links: [
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  newsletter: {
    title: "Sign up for occasional interactions",
    placeholder: "Your Email Address",
    buttonText: "SUBSCRIBE",
  },
  copyright: {
    text: "© 2025 The Luxe Bureau. All Rights Reserved.",
    designCredit: {
      text: "Design & Creative Direction by",
      name: "Duncan Fenech",
      href: "#",
    },
  },
  logo: {
    src: "/TLB_Footer.svg",
    alt: "The Luxe Bureau Footer Logo",
    width: 200,
    height: 60,
  },
  background: {
    src: "/TLB_Footer_Background.png",
    alt: "Footer Background",
  },
};

export function Footer() {
  return (
    <footer className="relative mt-auto min-h-[400px]">
      <div className="absolute inset-0">
        <Image
          src={footerData.background.src}
          alt={footerData.background.alt}
          fill
          className="object-cover bg-no-repeat"
          priority={false}
        />
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-12 h-full min-h-[400px] flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-stone-200">
            <div>
              <h3 className="font-[200] mb-4 tracking-wider uppercase">
                {footerData.discover.title}
              </h3>
              <ul className="space-y-2">
                {footerData.discover.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="hover:text-stone-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className=" font-semibold mb-4 tracking-wider uppercase">
                {footerData.concierge.title}
              </h3>
              <ul className="space-y-2 ">
                {footerData.concierge.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="hover:text-stone-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 tracking-wider uppercase">
                {footerData.newsletter.title}
              </h3>
              <div className="flex border-b justify-between">
                <input
                  type="email"
                  placeholder={footerData.newsletter.placeholder}
                  className="border-0 bg-transparent px-0 py-3 text-stone-200 focus:border-stone-600 text-sm focus:ring-0 outline-none rounded-none focus-visible:ring-0 placeholder:text-stone-300"
                />
                <button className="px-6 py-2 text-white text-sm font-medium transition-colors">
                  {footerData.newsletter.buttonText}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 text-white text-sm">
            <p>{footerData.copyright.text}</p>
            <p>
              {footerData.copyright.designCredit.text}{" "}
              <Link 
                href={footerData.copyright.designCredit.href} 
                className="underline hover:no-underline"
              >
                {footerData.copyright.designCredit.name}
              </Link>
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-20">
          <Image
            src={footerData.logo.src}
            alt={footerData.logo.alt}
            width={footerData.logo.width}
            height={footerData.logo.height}
            className="opacity-80 w-20"
          />
        </div>
      </div>
    </footer>
  );
}
