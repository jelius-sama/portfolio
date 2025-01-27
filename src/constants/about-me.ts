import ENV from "@/root/env.mjs";
import { About as AboutInterface } from "@/types/about";

export const About: AboutInterface = {
    name: "Jelius Basumatary",
    nickName: "Jelius-sama",
    description: "A showcase of my expertise in Fullstack Web and App development, featuring functional and visually appealing applications. This site showcases my skills, adaptability, and dedication to continuous learning and improvement in modern web and app development practices.",
    linksDescription: "A personalized hub showcasing all of Jelius's social media profiles and key links.",
    profession: "Student",
    education: "St. John's H.S. School, Barama",
    experience: [
        {
            timespan: 2022,
            field: "Fullstack Development"
        }
    ],
    dob: new Date("2006-11-26"),
    speech: "Programming is the art of transforming ideas into functional, impactful solutions. With expertise in Next.js and full-stack development, I combine technical precision with creative problem-solving to craft applications that deliver seamless user experiences. Every project is an opportunity to innovate, refine, and exceed expectations. My work reflects a commitment to efficiency, scalability, and attention to detail. Whether it's designing dynamic interfaces or building robust backend systems, I thrive on creating meaningful results. Explore my portfolio to discover how I turn challenges into opportunities and concepts into reality.",
    quote: "Code is more than logic—it's creativity in motion, transforming ideas into experiences that inspire and empower.",    
    explore: {
        'Frontend Development': [
            { technology: "ReactJS", level: "Experienced" },
            { technology: "React Native", level: "Experienced" },
            { technology: "NextJS", level: "Experienced" },
            { technology: "Svelte Kit", level: "Experienced" },
            { technology: "Svelte", level: "Experienced" },
        ],
        'Backend Development': [
            { technology: "NodeJS", level: "Beginner" },
            { technology: "Postgres", level: "Intermediate" },
        ],
        'Software Development': [
            { technology: 'Rust', level: 'Beginner' },
            { technology: 'C++', level: 'Beginner' },
            { technology: 'Typescript', level: 'Experienced' },
            { technology: 'Javascript', level: 'Experienced' },
            { technology: 'Swift', level: 'Beginner' }
        ]
    },
    projects_demo: [
        {
            title: "Demo",
            thumbnail: "",
            github_url: "https://github.com",
            live_demo_url: "https://github.com",
            description: "Demo description 1"
        },
        {
            title: "Demo 2",
            thumbnail: "",
            github_url: "https://github.com",
            live_demo_url: "https://github.com",
            description: "Demo description 2"
        }
    ],
    contact_options: {
        gmail: 'mailto:jelius.basumatary.sama@gmail.com',
        links: ENV.routes.links,
        x: 'https://x.com/jelius_sama',
        linkedin: 'https://www.linkedin.com/in/jelius-basumatary-485044339/'
    },
    github: "https://github.com/jelius-sama",
    xHandle: "@jelius_sama",
    social_links: [
        { icon: { light: '/assets/twitter.png', dark: '/assets/twitter.png' }, title: 'X', link: 'https://x.com/jelius_sama' },
        // { icon: { light: '/assets/Instagram_icon.webp', dark: '/assets/Instagram_icon.webp' }, title: 'Instagram', link: 'https://www.instagram.com/__kana.arima' },
        // { icon: { light: '/assets/Instagram_icon.webp', dark: '/assets/Instagram_icon.webp' }, title: 'Instagram (Personal)', link: 'https://www.instagram.com/_kazuma_sama' },
        // { icon: { light: '/assets/facebook(1).png', dark: '/assets/facebook(1).png' }, title: 'Facebook', link: 'https://www.facebook.com/satou.kazu.kun' },
        { icon: { light: '/assets/youtube.png', dark: '/assets/youtube.png' }, title: 'YouTube', link: 'https://www.youtube.com/@_kazuma-kun' },
        { icon: { light: '/assets/github-mark.png', dark: '/assets/github-mark.png' }, title: 'Github', link: 'https://github.com/jelius-sama' },
        { icon: { light: '/assets/linkedin-icon.png', dark: '/assets/linkedin-icon.png' }, title: 'LinkedIn', link: 'https://www.linkedin.com/in/jelius-basumatary-485044339/' },
    ]
};