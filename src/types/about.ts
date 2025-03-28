export type TechStack = "Postgres" | "ReactJS" | "NextJS" | "React Native" | "Svelte" | "Svelte Kit" | "Javascript" | "Typescript" | "C++" | "Swift" | "Rust" | "Go" | "Dart" | "Flutter" | "Ruby" | "Python" | "C#" | "Unity Engene" | "Unreal Engene" | "Java" | "Kotlin" | "SwiftUI" | "MongoDB" | "Postgress" | "MySQL" | "SQL Lite" | "Git" | "CSS" | "HTML" | "Vapor" | "NodeJS" | "C";

export type Profession = "Student" | "Software Developer" | "Software Engineer" | "Fullstack Developer" | "Frontend Developer" | "Backend Developer";

export type Field = "Software Development" | "Software Engineer" | "Fullstack Development" | "Frontend Development" | "Backend Development" | "Web Development" | "App Development" | "Game Development" | "AI Development" | "Cyber Security" | "Database" | "Programming Languages" | "Languages";

export type Explore = {
    technology: TechStack,
    level: "Experienced" | "Intermediate" | "Beginner" | "Learning";
};

export interface About {
    name: string;
    firstName?: string;
    nickName?: string;
    description: string;
    linksDescription: string;
    profession: Profession;
    education: string;
    experience: {
        timespan: number;
        field: Field;
    }[];
    dob: Date;
    speech: string;
    quote: string;
    explore: {
        [K in Field]?: Explore[];
    };
    projects_demo: {
        title: string;
        thumbnail: string;
        github_url: string;
        live_demo_url: string;
        description: string;
    }[];
    contact_options: {
        gmail?: string;
        x?: string;
        linkedin?: string;
        links: string;
    };
    github?: string;
    xHandle?: string;
    social_links: {
        icon: { dark: string, light: string; };
        title: string;
        link: string;
    }[];
}

