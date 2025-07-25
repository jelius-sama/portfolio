import { TerminalWindow } from "@/components/ui/terminal-window"
import { useConfig } from "@/contexts/config"

export function AboutSection() {
    const { app: { portfolio: me } } = useConfig()

    return (
        <section id="about" className="max-w-6xl mx-auto py-20 px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
                <span className="text-orange-400">|</span> <span className="text-white">Who Am I</span>
            </h2>

            <TerminalWindow title="about-me" className="mb-8">
                <div className="font-mono text-gray-300 space-y-4">
                    {me.about_me.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </TerminalWindow>
        </section>
    )
}
