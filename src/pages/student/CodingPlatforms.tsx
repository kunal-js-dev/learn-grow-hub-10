import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const platforms = [
  {
    name: "HackerRank",
    description: "Practice coding, prepare for interviews, and get hired. Solve challenges in 35+ languages.",
    url: "https://www.hackerrank.com",
    color: "bg-success/10 text-success",
    initials: "HR",
  },
  {
    name: "LeetCode",
    description: "The world's leading online programming learning platform. 3000+ problems to practice.",
    url: "https://www.leetcode.com",
    color: "bg-warning/10 text-warning",
    initials: "LC",
  },
  {
    name: "CodeChef",
    description: "Competitive programming platform with contests, tutorials, and a vibrant community.",
    url: "https://www.codechef.com",
    color: "bg-primary/10 text-primary",
    initials: "CC",
  },
];

export default function CodingPlatforms() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Top Coding Platforms</h1>
        <p className="mt-1 text-muted-foreground">Sharpen your skills on the best platforms</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => (
          <Card key={platform.name} className="group shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold ${platform.color}`}>
                {platform.initials}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">{platform.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{platform.description}</p>
              <Button asChild className="w-full gradient-primary text-primary-foreground">
                <a href={platform.url} target="_blank" rel="noopener noreferrer">
                  Visit Platform
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
