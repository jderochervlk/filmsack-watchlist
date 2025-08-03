import Parser from "npm:rss-parser";

const CURRENT_EPISODE = 417;

const parser = new Parser();

const feed = await parser.parseURL(
  "https://feeds.acast.com/public/shows/6500f93e9654d100128055d8",
);

const skipped: Array<string> = [];

const toListen: Set<string> = new Set();

const getNumberFromStringStd = (inputString: string) => {
  const match = inputString.match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
};

const sortEpisode = (title?: string) => {
  if (title?.includes(":")) {
    // console.log(title)
    const [head] = title.split(":");
    const episideNumber = getNumberFromStringStd(head);
    if (
      episideNumber && episideNumber > CURRENT_EPISODE &&
      episideNumber < 1000 &&
      !title.includes("ROUND TABLE") && !title.includes("WATCH-") &&
      !title.includes("watch-") &&
      !title.includes("Watch-") &&
      !title.includes("Watchalong") &&
      !title.includes("Round Table") &&
      !title.includes("Roundtable")
    ) {
      toListen.add(title);
    }
  } else if (title) {
    skipped.push(title);
  }
};

feed.items.forEach(({ title }) => sortEpisode(title));

const sorted = [...toListen].sort();

let text = `---
layout: "base.njk"
title: "Josh's Filmsack Episode Watchlist"
---
<link rel="stylesheet" href="/pico.css">

## Expected time to catch up

I am currently **${sorted.length}** epidsodes behind.
`;

text = `${text}\n\n`;

[3, 4, 5, 6, 7].forEach((n) =>
  text = `${text}\nIf I listen to ${n} episodes a week I will catch up in ${
    Math.round(toListen.size / n)
  } weeks`
);

text = `${text}\n## Episodes`;

sorted.forEach((title) => text = `${text}\n- ${title}`);

await Deno.writeTextFile("index.md", text);
