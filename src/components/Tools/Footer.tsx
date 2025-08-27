import Image from "next/image";
import Link from "next/link";

const footerData = {
  discover: {
    title: "Discover",
    links: [
      { label: "Shop", href: "/products" },
      { label: "About", href: "https://www.theluxebureau.com/about-draft/" },
      { label: "Instagram", href: "https://www.instagram.com/theluxebureau/" },
    ],
  },
  concierge: {
    title: "Concierge",
    links: [
      { label: "Cookies", href: "/shipping" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Term & Conditions", href: "/fa" },
      { label: "Contact", href: "https://www.theluxebureau.com/contact" },
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
    <footer className="relative mt-auto min-h-[300px]">
      <div className="absolute inset-0">
        <Image
          src={footerData.background.src}
          alt={footerData.background.alt}
          fill
          className="object-cover bg-no-repeat"
          priority={false}
          loading="lazy"
        />
      </div>

      <div className="relative z-10 text-[#FBF7E5]">
        <div className="mx-auto md:px-12 px-2 md:py-8 py-6 h-full min-h-[300px] flex flex-col justify-between">
          <div className="flex md:flex-row flex-col justify-between">
            <div className="flex md:space-x-44 gap-10">
              <div>
                <h3 className="font-[400] font-[Marfa] text-[0.875rem] mb-3 leading-[1.625rem] tracking-[0.0875rem] uppercase">
                  {footerData.discover.title}
                </h3>
                <ul className="">
                  {footerData.discover.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="hover:text-stone-300 transition-colors font-[Marfa]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-[400] font-[Marfa] text-[0.875rem] mb-3 leading-[1.625rem] tracking-[0.0875rem] uppercase">
                  {footerData.concierge.title}
                </h3>
                <ul className="">
                  {footerData.concierge.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="hover:text-stone-300 transition-colors font-[Marfa]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:pt-0 pt-4">
              <div className="flex border-b justify-between">
                <input
                  type="email"
                  placeholder={footerData.newsletter.placeholder}
                  className="border-0 bg-transparent px-0 py-3 text-stone-100 focus:border-stone-600 text-[1rem] focus:ring-0 outline-none rounded-none focus-visible:ring-0 placeholder:text-stone-100 font-[Marfa]"
                />
                <button className="md:pl-20 md:hidden lg:block py-2 text-stone-100 md:text-[1rem] font-medium transition-colors font-[Marfa]">
                  {footerData.newsletter.buttonText}
                </button>
              </div>
            </div>
          </div>

          <div className="md:pt-0 pt-4">
            <div className="md:absolute bottom-0 left-0 right-0 flex justify-center pb-10">
              <Image
                src={footerData.logo.src}
                alt={footerData.logo.alt}
                width={footerData.logo.width}
                height={footerData.logo.height}
                className="w-26"
                priority={false}
              />
            </div>
            <p className="font-[Marfa] md:text-[1rem] text-xs">
              {footerData.copyright.text}
            </p>
            <p className="font-[Marfa] md:text-[1rem] text-xs">
              {footerData.copyright.designCredit.text}{" "}
              <Link
                href={footerData.copyright.designCredit.href}
                className="underline hover:no-underline font-[Marfa]"
              >
                {footerData.copyright.designCredit.name}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
