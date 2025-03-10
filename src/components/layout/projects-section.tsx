'use client';

import Image from "next/image";
import SectionTitle from "@/components/layout/section-title";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ExternalLink, Github } from 'lucide-react';
import { useScrollToSection } from "@/hooks/useScrollToSection";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Title from "@/components/ui/title";

// Project type definition
type Project = {
    id: string;
    title: string;
    description: string;
    image: string;
    technologies?: string[];
    githubUrl?: string;
    liveUrl?: string;
};

// Projects data - you can add more projects in the future
const PROJECTS: Project[] = [
    {
        id: "1",
        title: "Pixelle",
        description: "An anime image gallery application with collections of illustrations and photography.",
        image: "/assets/project-pixelle.png",
        technologies: ["Next.js", "Tailwind CSS", "TypeScript"],
        githubUrl: "https://github.com/jelius-sama/pixelle-demo",
        liveUrl: "https://dbpfjfsp23llw.cloudfront.net/"
    },
    // You can add more projects here in the future
];

export default function ProjectsSection() {
    const scrollToSection = useScrollToSection();

    return (
        <section id="projects" className="min-h-screen w-full relative pb-[calc(64px_+_16px)] pt-[64px]">
            <SectionTitle info={"Browse My Recent"} title={"Projects"} classNames={{ title: "!leading-[70px]" }} />

            {PROJECTS.length === 0 ? (
                <div className="flex items-center h-full justify-center">
                    <Title varient={"subtitle"} className="text-center underline">No Projects</Title>
                </div>
            ) : (
                <div className="container mx-auto mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PROJECTS.map((project) => (
                            <Card key={project.id} className="overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                                <div className="relative aspect-video overflow-hidden mt-4 mx-4 rounded-t-md">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill={true}
                                        className="object-cover object-top"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                                    <p className="text-zinc-400 text-sm mb-3">{project.description}</p>
                                    {project.technologies && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {project.technologies.map((tech) => (
                                                <span key={tech} className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex gap-3">
                                    {project.githubUrl && (
                                        <Button variant="outline" size="sm" className="gap-2" asChild>
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                <Github className="h-4 w-4" />
                                                Code
                                            </a>
                                        </Button>
                                    )}
                                    {project.liveUrl && (
                                        <Button size="sm" className="gap-2" asChild>
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4" />
                                                Live Demo
                                            </a>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <Button className='absolute right-[16px] bottom-[16px] rounded-full h-10 w-10 p-2' variant={'outline'} onClick={() => scrollToSection('contacts')} aria-label="Scroll to contacts section">
                <ChevronDownIcon />
            </Button>
        </section>
    );
}
