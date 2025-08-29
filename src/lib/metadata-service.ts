import { getHeroData } from "./hero-service";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  // Fallback metadata for build time and when database is not available
  const fallbackMetadata: Metadata = {
    title: "Md. Riazul Islam - Software Engineer",
    description:
      "Passionate Software Engineer specializing in MERN stack, creating modern websites and web applications.",
    keywords:
      "Software Engineer, Full Stack Software Engineer, MERN Stack, Web Developer, React, Node.js, JavaScript, Python, MongoDB, Portfolio",
    authors: [{ name: "Md. Riazul Islam" }],
    icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
    },
    openGraph: {
      title: "Md. Riazul Islam - Software Engineer",
      description:
        "Passionate Software Engineer specializing in MERN stack development",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/favicon.png",
          width: 1200,
          height: 630,
          alt: "Md. Riazul Islam - Software Engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Md. Riazul Islam - Software Engineer",
      description:
        "Passionate Software Engineer specializing in MERN stack development",
      images: ["/favicon.png"],
    },
  };

  try {
    const heroData = await getHeroData();

    if (!heroData) {
      return fallbackMetadata;
    }

    const title = `${heroData.name} - Software Engineer`;
    const description = heroData.description;
    const profileImage = heroData.profileImage || "/favicon.png";

    return {
      title,
      description,
      keywords:
        "Software Engineer, Full Stack Software Engineer, MERN Stack, Web Developer, React, Node.js, JavaScript, Python, MongoDB, Portfolio",
      authors: [{ name: heroData.name }],
      icons: {
        icon: profileImage,
        apple: profileImage,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "en_US",
        images: [
          {
            url: profileImage,
            width: 1200,
            height: 630,
            alt: `${heroData.name} - Software Engineer`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [profileImage],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return fallbackMetadata;
  }
}
