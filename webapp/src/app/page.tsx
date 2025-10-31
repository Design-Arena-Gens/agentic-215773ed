"use client";

import { useMemo, useState } from "react";

type GoalOption =
  | "drive saves"
  | "grow followers"
  | "promote product"
  | "increase website clicks";

type HookStyle = "question" | "bold claim" | "pattern interrupt" | "story teaser";
type FormatStyle =
  | "tutorial"
  | "story"
  | "behind the scenes"
  | "listicle"
  | "before & after";
type PaceOption = "fast" | "steady" | "slow";
type DeliveryStyle = "on-camera" | "voiceover" | "text-led";

type FormState = {
  topic: string;
  audience: string;
  goal: GoalOption;
  tone: string;
  callToAction: string;
  duration: number;
  hookStyle: HookStyle;
  formatStyle: FormatStyle;
  pace: PaceOption;
  delivery: DeliveryStyle;
  includeBroll: boolean;
  includeCaptions: boolean;
  trendingAudio: boolean;
};

type Scene = {
  id: number;
  label: string;
  start: number;
  end: number;
  focus: string;
  script: string;
  visual: string;
  camera: string;
};

type ReelPlan = {
  primaryHook: string;
  backupHooks: string[];
  narrativeAngle: string;
  scenes: Scene[];
  caption: {
    opener: string;
    body: string[];
    closer: string;
  };
  hashtags: string[][];
  audio: {
    title: string;
    rationale: string;
  };
  postingWindows: string[];
  retentionDevices: string[];
  transitions: string[];
  velocityTips: string[];
  metricToWatch: string;
  brollIdeas: string[];
  overlayPrompts: string[];
};

const initialForm: FormState = {
  topic: "3-step 10-minute meal prep for busy weeks",
  audience: "young professionals who want healthy food fast",
  goal: "drive saves",
  tone: "energetic and encouraging",
  callToAction: "Save this so your Sunday prep is stress-free",
  duration: 42,
  hookStyle: "question",
  formatStyle: "tutorial",
  pace: "fast",
  delivery: "voiceover",
  includeBroll: true,
  includeCaptions: true,
  trendingAudio: true,
};

const GOAL_METRIC_MAP: Record<GoalOption, string> = {
  "drive saves": "Track saves per view and completion rate",
  "grow followers": "Monitor profile visits and follows per reach",
  "promote product": "Watch click-throughs and adds-to-cart",
  "increase website clicks": "Focus on link taps and retention to CTA",
};

const PACE_DURATION_TARGET: Record<PaceOption, number> = {
  fast: 4,
  steady: 6,
  slow: 8,
};

const DELIVERY_VISUALS: Record<DeliveryStyle, string> = {
  "on-camera": "High-energy direct-to-camera delivery with clean background and good lighting",
  voiceover:
    "Voiceover layered on top of visually engaging B-roll; keep narration punchy with micro-pauses",
  "text-led":
    "Minimal voice, rely on bold kinetic typography synced to beat; mix in gestures for emphasis",
};

const FORMATS: Record<FormatStyle, string> = {
  tutorial:
    "Teaching something actionable step-by-step. Lean on over-the-shoulder shots and crisp overlays.",
  story:
    "Narrative arc with tension and release. Alternate between speaker and cutaways to maintain pacing.",
  "behind the scenes":
    "Show raw process snippets, layer progress markers, and end with polished reveal.",
  listicle:
    "Rapid-fire list with snappy transitions; anchor each beat with bold text and supporting visual.",
  "before & after":
    "Contrast the messy 'before' with the polished 'after'. Use match cuts and emphasize transformation.",
};

const HOOK_BLUEPRINTS: Record<HookStyle, string[]> = {
  question: [
    "Did you know {audience} lose hours every week trying to {topic_fragment}?",
    "What if {audience} could {outcome} in just {timeframe}?",
    "Are you still {undesired_action}? Here's how to switch it up today.",
  ],
  "bold claim": [
    "This {timeframe} switch rewired how {audience} tackle {topic_fragment}.",
    "Stop scrolling. This is the simplest {topic_fragment} you'll see all week.",
    "I bet you haven't tried this {unexpected_angle} for {topic_fragment}.",
  ],
  ["pattern interrupt"]: [
    "*Record scratch* {pain_point} ends now. Here's the play-by-play.",
    "You're overcomplicating {topic_fragment}. Steal this instead.",
    "Pause. Swap your usual move for this {formatStyle} blueprint.",
  ],
  ["story teaser"]: [
    "Last {timeframe}, I was {pain_point_description}. Here's what fixed it.",
    "POV: You're {audience_descriptor} and everything feels like chaos until this.",
    "The moment I switched to this {formatStyle} flow, everything changed.",
  ],
};

const BACKUP_HOOKS: string[] = [
  "You're {steps} micro-shifts away from {desired_outcome}.",
  "If you only copy one {formatStyle} today, make it this one.",
  "Screenshots won't cut it—save this so you can actually execute.",
  "Watch me turn {pain_point_description} into {desired_outcome} in {timeframe}.",
  "Spoiler: {unexpected_angle} is the cheat code your feed needed.",
];

const GOAL_TACTICS: Record<GoalOption, string[]> = {
  "drive saves": [
    "Call out exactly when viewers should tap the ribbon icon.",
    "Stack multiple quick wins to increase replay value.",
    "Show an on-screen checklist to reward saves.",
  ],
  "grow followers": [
    "Speak in insider language so viewers feel part of the club.",
    "Tease tomorrow's post to encourage the follow.",
    "Flash micro-proof like DMs or comments to build social proof.",
  ],
  "promote product": [
    "Show tactile product close-ups to trigger desire.",
    "Highlight the transformation before mentioning price.",
    "Use text overlays to reinforce the product name and benefit.",
  ],
  "increase website clicks": [
    "Use a gestural CTA pointing toward the link sticker.",
    "Promise a downloadable bonus available only via the link.",
    "Add urgency with a countdown or limited-time copy on screen.",
  ],
};

const RETENTION_DEVICES = [
  "Jump cuts synced to the beat",
  "Fast-paced headline overlays every 2 seconds",
  "Pattern interrupt with a quick zoom punch-in",
  "Overlay a progress bar to signal completion",
  "Call-to-action indicator pops in at the 70% mark",
  "Swap between wide and detail shots to reset attention",
  "Use on-screen subtitles with emojis to match pacing",
];

const TRANSITIONS = [
  "Snap transition",
  "Match cut using hand clap",
  "Finger cover transition",
  "Speed ramp between scenes",
  "Whip pan to reset the scene",
  "Vertical slide with masked motion",
];

const TRENDING_AUDIO_BANK = [
  {
    title: "Trending chill-hop loop @85bpm",
    rationale: "Pairs well with voiceovers and keeps energy without overpowering narration.",
  },
  {
    title: "Upbeat percussion loop (IG trending)",
    rationale: "Complements fast cuts and emphasizes transitions for a punchy delivery.",
  },
  {
    title: "Dreamy synth pad build",
    rationale: "Great for story-driven reels and before/after reveals with emotional lift.",
  },
];

const ORIGINAL_AUDIO = {
  title: "Original voiceover with subtle room tone",
  rationale:
    "Keeps focus on your message while allowing custom pacing. Layer soft risers under key beats.",
};

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function formatSeconds(value: number) {
  const rounded = Math.round(value);
  return `${rounded}s`;
}

function camelHashtag(phrase: string) {
  return (
    "#" +
    phrase
      .replace(/[^\w\s]/g, "")
      .trim()
      .split(/\s+/)
      .map((word, index) =>
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join("")
  );
}

function derivePainPoint(topic: string, audience: string) {
  if (!topic || !audience) return "losing time";
  if (topic.toLowerCase().includes("content")) return "burning hours creating content";
  if (topic.toLowerCase().includes("meal")) return "spending every evening scrambling dinner";
  if (topic.toLowerCase().includes("fitness")) return "skipping workouts when schedules collapse";
  return `struggling with ${topic.toLowerCase()}`;
}

function deriveOutcome(goal: GoalOption, topic: string) {
  switch (goal) {
    case "drive saves":
      return `having this ${topic.toLowerCase()} system on standby`;
    case "grow followers":
      return `turning curious scrollers into obsessed followers`;
    case "promote product":
      return `getting your dream customers to say “take my money”`;
    case "increase website clicks":
      return `sending traffic straight to your link in bio`;
    default:
      return `making ${topic.toLowerCase()} effortless`;
  }
}

function deriveTimeframe(duration: number) {
  if (duration <= 30) return "30 seconds";
  if (duration <= 45) return "45 seconds";
  if (duration <= 60) return "under a minute";
  return "a minute";
}

function buildHook(form: FormState) {
  const painPoint = derivePainPoint(form.topic, form.audience);
  const outcome = deriveOutcome(form.goal, form.topic);
  const timeframe = deriveTimeframe(form.duration);
  const aura = form.topic.toLowerCase().replace(/^(the|a|an)\s/i, "");
  const unexpectedAngle =
    form.formatStyle === "tutorial"
      ? "step you skipped"
      : form.formatStyle === "listicle"
      ? "list that actually delivers"
      : "loophole no one's talking about";

  let hook = pickRandom(HOOK_BLUEPRINTS[form.hookStyle]);
  hook = hook.replaceAll("{audience}", form.audience);
  hook = hook.replaceAll("{pain_point}", painPoint);
  hook = hook.replaceAll("{topic_fragment}", aura);
  hook = hook.replaceAll("{outcome}", outcome);
  hook = hook.replaceAll("{timeframe}", timeframe);
  hook = hook.replaceAll(
    "{undesired_action}",
    `making ${form.topic.toLowerCase()} harder than it needs to be`,
  );
  hook = hook.replaceAll("{formatStyle}", form.formatStyle);
  hook = hook.replaceAll("{pain_point_description}", painPoint);
  hook = hook.replaceAll("{unexpected_angle}", unexpectedAngle);
  hook = hook.replaceAll("{audience_descriptor}", form.audience);
  hook = hook.replaceAll("{dream_state}", outcome);
  return hook;
}

function buildBackupHooks(form: FormState, count = 3) {
  const painPoint = derivePainPoint(form.topic, form.audience);
  const outcome = deriveOutcome(form.goal, form.topic);
  const timeframe = deriveTimeframe(form.duration);
  return Array.from({ length: count }, () =>
    pickRandom(BACKUP_HOOKS)
      .replaceAll(
        "{steps}",
        Math.max(3, Math.min(6, Math.round(form.duration / 8))).toString(),
      )
      .replaceAll("{desired_outcome}", outcome)
      .replaceAll("{formatStyle}", form.formatStyle)
      .replaceAll("{pain_point_description}", painPoint)
      .replaceAll("{timeframe}", timeframe)
      .replaceAll("{unexpected_angle}", "micro-shift you haven't tried"),
  );
}

type BeatDefinition = {
  label: string;
  focus: (form: FormState) => string;
  script: (form: FormState) => string;
  visual: (form: FormState) => string;
  camera: (form: FormState) => string;
};

const CORE_BEATS: BeatDefinition[] = [
  {
    label: "Hook",
    focus: (form) => buildHook(form),
    script: (form) => buildHook(form),
    visual: (form) =>
      form.delivery === "text-led"
        ? "Overlay bold kinetic text with quick cut of end result."
        : "Punch-in shot with confident gesture. Flash end result within first 2 seconds.",
    camera: () => "Start with a rapid punch-in shot at eye level, add subtle hand movement.",
  },
  {
    label: "Context Snapshot",
    focus: (form) => `Paint the current frustration ${form.audience} feels about ${form.topic}.`,
    script: (form) =>
      `If you're ${form.audience}, you probably ${derivePainPoint(form.topic, form.audience)}. Here's the exact system I use.`,
    visual: (form) =>
      form.formatStyle === "story"
        ? "Cut to candid B-roll illustrating the 'before' moment."
        : "Show the messy setup or the problem in action with overlay text.",
    camera: () => "Handheld movement or quick pan to keep energy lifted.",
  },
  {
    label: "Breakdown Step",
    focus: (form) =>
      `Show step-by-step ${form.topic.toLowerCase()} with emphasis on quick win.`,
    script: (form) =>
      `Step 1: ${form.topic.split(" ")[0] === "3-step" ? "Start with the quick reset" : "Do this first so the rest is easy"}. Highlight why it matters in 1 sentence.`,
    visual: (form) =>
      form.delivery === "voiceover"
        ? "Overlay close-up demo shot with captions and highlight key detail."
        : "Split screen between you explaining and the process happening.",
    camera: () => "Alternate between 1x and 0.5x zoom for dynamic pacing.",
  },
  {
    label: "Proof / Credibility",
    focus: () => "Validate the method with data, results, or social proof.",
    script: (form) =>
      `I've used this to {result}. Swipe to see the difference in just one ${deriveTimeframe(form.duration)}.`,
    visual: () => "Cut to results montage, analytics screenshot, or before/after overlay.",
    camera: () => "Use a quick dolly-in or spotlight effect to amplify transformation.",
  },
  {
    label: "CTA",
    focus: (form) => form.callToAction,
    script: (form) =>
      `${form.callToAction}. Drop a 🔥 if you're trying this ${deriveTimeframe(form.duration)} flow.`,
    visual: (form) =>
      form.delivery === "on-camera"
        ? "Back to you on camera with confident smile and gesture toward CTA text."
        : "Final beauty shot with animated arrow toward CTA overlay.",
    camera: () => "Return to original framing for consistency and handshake outro.",
  },
];

const EXPANSION_BEATS: BeatDefinition[] = [
  {
    label: "Micro Tip",
    focus: (form) => `Bonus optimization to help ${form.audience} execute faster.`,
    script: () => "Pro-tip: Batch this with a timer so you never overthink it.",
    visual: () => "Overlay timer graphic and highlight micro-step with pop text.",
    camera: () => "Cut-in macro detail with 120fps slow motion for contrast.",
  },
  {
    label: "Objection Crusher",
    focus: () => "Remove biggest excuse or friction point.",
    script: () => "Think you don't have the gear? Use whatever's in your fridge—we're focusing on momentum.",
    visual: () => "Show simplified version proving accessibility.",
    camera: () => "Switch to selfie mode for a conversational beat.",
  },
  {
    label: "Retention Loop",
    focus: () => "Insert a loop-worthy nugget the viewer will want to rewatch.",
    script: () => "Replay this shot so you catch the exact order. The timing matters.",
    visual: () => "Add subtle text cue 'rewatch to lock it in'.",
    camera: () => "Use quick reverse playback or boomerang moment.",
  },
];

function generateScenes(form: FormState): Scene[] {
  const targetBeatLength = PACE_DURATION_TARGET[form.pace];
  const desiredScenes = Math.max(4, Math.min(8, Math.round(form.duration / targetBeatLength)));

  const blueprint = [...CORE_BEATS];
  let expansionIndex = 0;
  while (blueprint.length < desiredScenes) {
    blueprint.splice(-1, 0, EXPANSION_BEATS[expansionIndex % EXPANSION_BEATS.length]);
    expansionIndex += 1;
  }

  const beatsToUse = blueprint.slice(0, desiredScenes);

  const unitDuration = form.duration / beatsToUse.length;
  let cursor = 0;

  return beatsToUse.map((beat, index) => {
    const start = cursor;
    const end = index === beatsToUse.length - 1 ? form.duration : cursor + unitDuration;
    cursor = end;

    return {
      id: index + 1,
      label: beat.label,
      start,
      end,
      focus: beat.focus(form),
      script: beat.script(form)
        .replace("{result}", form.goal === "promote product" ? "turn casual browsers into buyers" : "save hours every week"),
      visual: beat.visual(form),
      camera: beat.camera(form),
    };
  });
}

function buildCaption(form: FormState, scenes: Scene[]): ReelPlan["caption"] {
  const body = scenes
    .filter((scene) => !["Hook", "CTA"].includes(scene.label))
    .slice(0, 3)
    .map((scene) => `• ${scene.label}: ${scene.focus.replace(/\.$/, "")}.`);

  const opener = `🚀 ${capitalize(form.topic)} for ${capitalize(form.audience)}`;
  const closer = `${form.callToAction} ${form.goal === "grow followers" ? "Follow for the full playbook." : "DM me “REEL” for the template."}`;

  return { opener, body, closer };
}

function buildHashtags(form: FormState): string[][] {
  const base = [
    camelHashtag(form.topic),
    camelHashtag(form.audience),
    camelHashtag(form.formatStyle + "Reels"),
    camelHashtag(form.goal),
    camelHashtag("content strategy"),
  ];

  const variants = [
    [camelHashtag("how to"), camelHashtag("creator tips"), camelHashtag("reel ideas"), camelHashtag("viral hooks"), camelHashtag("content that converts")],
    [camelHashtag(form.topic + " tutorial"), camelHashtag("instagram reels"), camelHashtag("reelsstrategy"), camelHashtag("hook formula"), camelHashtag("reelsthatperform")],
  ];

  return [base, ...variants];
}

function buildAudio(form: FormState): ReelPlan["audio"] {
  if (form.trendingAudio) {
    return pickRandom(TRENDING_AUDIO_BANK);
  }
  return ORIGINAL_AUDIO;
}

function buildVelocityTips(form: FormState): string[] {
  const delivery = DELIVERY_VISUALS[form.delivery];
  const formatNotes = FORMATS[form.formatStyle];
  return [
    `Pacing: Keep clips to ~${PACE_DURATION_TARGET[form.pace]}s each to align with a ${form.pace} delivery.`,
    `Tone: Keep the vibe ${form.tone}. Script in phrases you would naturally say on camera.`,
    `Delivery: ${delivery}`,
    `Format emphasis: ${formatNotes}`,
    pickRandom(GOAL_TACTICS[form.goal]),
  ];
}

function buildBrollIdeas(form: FormState): string[] {
  if (!form.includeBroll) return [];
  const base = [
    "Overhead shot of workspace reset",
    "Close-up of hands executing the key step",
    "Screen recording of process with cursor highlights",
    "Quick reaction shot or smile to humanize",
    "Product or tool hero shot with slow push-in",
  ];
  const topicLower = form.topic.toLowerCase();
  if (topicLower.includes("meal")) {
    base.push("Macro shot of ingredients hitting the pan", "Fridge organization reveal with timer overlay");
  } else if (topicLower.includes("content")) {
    base.push("Calendar view of content plan filling in", "BTS of filming setup with lighting adjustments");
  } else if (topicLower.includes("fitness")) {
    base.push("Before/after posture comparison", "Quick sweat wipe moment to show authenticity");
  }
  return base.slice(0, 6);
}

function buildOverlayPrompts(form: FormState): string[] {
  if (!form.includeCaptions) return [];
  return [
    "Hook text: bold 4-word promise with emoji accent",
    "Add timer overlay during key steps to inject urgency",
    "Feature CTA banner at 80% view duration with arrow toward link",
    "Use color-coded keywords (action verbs in accent color)",
  ];
}

function generatePlan(form: FormState): ReelPlan {
  const scenes = generateScenes(form);

  return {
    primaryHook: buildHook(form),
    backupHooks: buildBackupHooks(form),
    narrativeAngle: FORMATS[form.formatStyle],
    scenes,
    caption: buildCaption(form, scenes),
    hashtags: buildHashtags(form),
    audio: buildAudio(form),
    postingWindows: recommendPostingWindows(form),
    retentionDevices: pickUnique(RETENTION_DEVICES, 3),
    transitions: pickUnique(TRANSITIONS, 3),
    velocityTips: buildVelocityTips(form),
    metricToWatch: GOAL_METRIC_MAP[form.goal],
    brollIdeas: buildBrollIdeas(form),
    overlayPrompts: buildOverlayPrompts(form),
  };
}

function pickUnique<T>(items: T[], count: number): T[] {
  const pool = [...items];
  const selection: T[] = [];
  while (selection.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    selection.push(pool.splice(index, 1)[0]);
  }
  return selection;
}

function recommendPostingWindows(form: FormState) {
  const fast = ["Mon 8:15a", "Wed 11:30a", "Sun 6:45p"];
  const steady = ["Tue 9:30a", "Thu 12:05p", "Sat 10:20a"];
  const slow = ["Mon 7:45p", "Wed 8:10p", "Sun 9:00a"];
  const base =
    form.pace === "fast" ? fast : form.pace === "steady" ? steady : slow;
  return base.map(
    (slot) =>
      `${slot} • ${form.audience
        .split(" ")
        .slice(0, 2)
        .join(" ")} engagement spike`,
  );
}

function capitalize(value: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [plan, setPlan] = useState<ReelPlan>(() => generatePlan(initialForm));
  const [lastGenerated, setLastGenerated] = useState<Date>(new Date());

  const sceneTimeline = useMemo(
    () =>
      plan.scenes.map((scene) => ({
        ...scene,
        duration: `${formatSeconds(scene.start)} → ${formatSeconds(scene.end)}`,
      })),
    [plan.scenes],
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-4 py-10 text-zinc-900 lg:flex-row lg:px-8">
      <section className="lg:w-5/12">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_40px_80px_-40px_rgba(107,61,250,0.45)] backdrop-blur">
          <header className="space-y-2 pb-6">
            <p className="text-xs uppercase tracking-[0.32em] text-violet-500">
              Reel Automator
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-zinc-950">
              Automate Instagram Reels that stick, save, and sell.
            </h1>
            <p className="text-sm text-zinc-600">
              Feed the form, tap Generate, and get a production-ready hook, script timeline, captions, posting windows, and more—optimized for {form.goal}.
            </p>
          </header>

          <form
            className="space-y-5 text-sm"
            onSubmit={(event) => {
              event.preventDefault();
              setPlan(generatePlan(form));
              setLastGenerated(new Date());
            }}
          >
            <div className="grid gap-4">
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Reel topic
                </span>
                <input
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.topic}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, topic: event.target.value }))
                  }
                  placeholder="60-second productivity power-up"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Target audience
                </span>
                <input
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.audience}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, audience: event.target.value }))
                  }
                  placeholder="creators juggling content and clients"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Primary goal
                </span>
                <select
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.goal}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      goal: event.target.value as GoalOption,
                    }))
                  }
                >
                  <option value="drive saves">Drive saves</option>
                  <option value="grow followers">Grow followers</option>
                  <option value="promote product">Promote product</option>
                  <option value="increase website clicks">Increase website clicks</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Tone
                </span>
                <input
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.tone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, tone: event.target.value }))
                  }
                  placeholder="energetic and actionable"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Call to action
                </span>
                <input
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.callToAction}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, callToAction: event.target.value }))
                  }
                  placeholder="Save this for your next filming day"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Reel duration (seconds)
                </span>
                <input
                  type="number"
                  min={15}
                  max={90}
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.duration}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      duration: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Hook style
                </span>
                <select
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.hookStyle}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      hookStyle: event.target.value as HookStyle,
                    }))
                  }
                >
                  <option value="question">Question</option>
                  <option value="bold claim">Bold claim</option>
                  <option value="pattern interrupt">Pattern interrupt</option>
                  <option value="story teaser">Story teaser</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Format
                </span>
                <select
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.formatStyle}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      formatStyle: event.target.value as FormatStyle,
                    }))
                  }
                >
                  <option value="tutorial">Tutorial</option>
                  <option value="story">Story</option>
                  <option value="behind the scenes">Behind the scenes</option>
                  <option value="listicle">Listicle</option>
                  <option value="before & after">Before & After</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Delivery
                </span>
                <select
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.delivery}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      delivery: event.target.value as DeliveryStyle,
                    }))
                  }
                >
                  <option value="voiceover">Voiceover + B-roll</option>
                  <option value="on-camera">On-camera</option>
                  <option value="text-led">Text-led</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Pace
                </span>
                <select
                  className="w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-300 transition focus:ring-2"
                  value={form.pace}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      pace: event.target.value as PaceOption,
                    }))
                  }
                >
                  <option value="fast">Fast</option>
                  <option value="steady">Steady</option>
                  <option value="slow">Slow</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 rounded-2xl bg-violet-50/60 p-4">
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-zinc-800">
                  Include supporting B-roll
                </span>
                <input
                  type="checkbox"
                  checked={form.includeBroll}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      includeBroll: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-violet-500"
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-zinc-800">
                  Include motion captions plan
                </span>
                <input
                  type="checkbox"
                  checked={form.includeCaptions}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      includeCaptions: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-violet-500"
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-zinc-800">
                  Suggest trending audio
                </span>
                <input
                  type="checkbox"
                  checked={form.trendingAudio}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      trendingAudio: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-violet-500"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/40 transition hover:bg-violet-500"
              >
                Generate plan
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  const freshPlan = generatePlan(initialForm);
                  setPlan(freshPlan);
                  setLastGenerated(new Date());
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 px-5 py-3 text-sm font-semibold text-violet-600 transition hover:border-violet-300 hover:bg-white"
              >
                Reset
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Updated {lastGenerated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
            </p>
          </form>
        </div>
      </section>

      <section className="lg:w-7/12">
        <div className="space-y-8">
          <article className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_30px_70px_-50px_rgba(71,32,180,1)] backdrop-blur">
            <header className="flex flex-col gap-2 border-b border-violet-100 pb-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                Hook Suite
              </span>
              <h2 className="text-2xl font-semibold text-zinc-950">{plan.primaryHook}</h2>
              <p className="text-sm text-zinc-600">
                Backup angles: {plan.backupHooks.join(" • ")}
              </p>
            </header>
            <dl className="grid gap-4 pt-4 text-sm md:grid-cols-2">
              <div className="rounded-2xl bg-violet-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-violet-500">
                  Narrative angle
                </dt>
                <dd className="text-sm text-zinc-800">{plan.narrativeAngle}</dd>
              </div>
              <div className="rounded-2xl bg-violet-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-violet-500">
                  Metric to watch
                </dt>
                <dd className="text-sm text-zinc-800">{plan.metricToWatch}</dd>
              </div>
            </dl>
          </article>

          <article className="space-y-5 rounded-3xl border border-white/70 bg-white/80 p-6 backdrop-blur">
            <header className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                Beat Timeline
              </span>
              <h3 className="text-xl font-semibold text-zinc-950">
                Scene-by-scene script with visual direction
              </h3>
            </header>
            <ol className="space-y-4">
              {sceneTimeline.map((scene) => (
                <li
                  key={scene.id}
                  className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white via-white to-violet-50/60 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                      {scene.label}
                    </span>
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-600">
                      {scene.duration}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-900">{scene.focus}</p>
                  <div className="mt-3 grid gap-3 text-xs text-zinc-600 md:grid-cols-3">
                    <div>
                      <p className="font-semibold text-zinc-800">Script</p>
                      <p>{scene.script}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-800">Visual cue</p>
                      <p>{scene.visual}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-800">Camera note</p>
                      <p>{scene.camera}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <article className="grid gap-5 rounded-3xl border border-white/70 bg-white/80 p-6 backdrop-blur md:grid-cols-2">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                Caption Engine
              </span>
              <p className="text-sm font-semibold text-zinc-900">{plan.caption.opener}</p>
              <div className="space-y-2 text-sm text-zinc-600">
                {plan.caption.body.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              <p className="text-sm font-medium text-zinc-900">{plan.caption.closer}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl bg-violet-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                  Hashtag stacks
                </p>
                <div className="mt-3 space-y-2 text-xs text-zinc-700">
                  {plan.hashtags.map((stack, index) => (
                    <p key={index} className="rounded-2xl bg-white/80 px-3 py-2">
                      {stack.join(" ")}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-violet-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                  Audio strategy
                </p>
                <p className="text-sm font-semibold text-zinc-900">{plan.audio.title}</p>
                <p className="text-xs text-zinc-600">{plan.audio.rationale}</p>
              </div>
            </div>
          </article>

          <article className="grid gap-5 rounded-3xl border border-white/70 bg-white/80 p-6 backdrop-blur md:grid-cols-2">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                Posting windows
              </span>
              <ul className="space-y-2 text-sm text-zinc-700">
                {plan.postingWindows.map((window, index) => (
                  <li key={index} className="rounded-xl bg-violet-50/80 px-4 py-2">
                    {window}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                Velocity stack
              </span>
              <ul className="space-y-2 text-sm text-zinc-700">
                {plan.velocityTips.map((tip, index) => (
                  <li key={index} className="rounded-xl bg-white px-4 py-2 shadow-sm">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {plan.brollIdeas.length > 0 && (
            <article className="grid gap-5 rounded-3xl border border-white/70 bg-white/80 p-6 backdrop-blur md:grid-cols-2">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                  B-roll checklist
                </span>
                <ul className="space-y-2 text-sm text-zinc-700">
                  {plan.brollIdeas.map((idea, index) => (
                    <li key={index} className="rounded-xl bg-violet-50/70 px-4 py-2">
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                  Motion overlays
                </span>
                <ul className="space-y-2 text-sm text-zinc-700">
                  {plan.overlayPrompts.length > 0 ? (
                    plan.overlayPrompts.map((overlay, index) => (
                      <li key={index} className="rounded-xl bg-white px-4 py-2 shadow-sm">
                        {overlay}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl bg-white px-4 py-2 text-xs text-zinc-500">
                      Toggle captions to unlock overlay prompts.
                    </li>
                  )}
                </ul>
              </div>
            </article>
          )}

          <article className="grid gap-5 rounded-3xl border border-white/70 bg-white/80 p-6 backdrop-blur md:grid-cols-2">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                Retention devices
              </span>
              <ul className="space-y-2 text-sm text-zinc-700">
                {plan.retentionDevices.map((device, index) => (
                  <li key={index} className="rounded-xl bg-violet-50/70 px-4 py-2">
                    {device}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                Transition ideas
              </span>
              <ul className="space-y-2 text-sm text-zinc-700">
                {plan.transitions.map((transition, index) => (
                  <li key={index} className="rounded-xl bg-white px-4 py-2 shadow-sm">
                    {transition}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
