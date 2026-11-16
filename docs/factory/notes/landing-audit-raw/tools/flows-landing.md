# Page: landing page of "Skill Foundry" (files: page.html = markup, site.css = styles, ui-strings.txt = visible strings)

Product (from the page itself): a static website that lists 10 "skills" (instruction folders for AI coding agents), each tested by real agents, each downloadable as a .zip or installable with one command. The visitor is a first-time visitor who found the link; they may be a developer, a business analyst, a QA person or a product owner.

Page order top to bottom as built: skip link; header (logo, nav Collection / Install / For agents / Proof, theme button, language button); hero (h1 "One line in. A skill out.", a search box "Find a skill", five role filter buttons, a typing animation panel "You type / You get", ten skill chips); section "Ready skills" (a grid of 10 skill cards, each with a cover image, tags, request, result, roles, test result, rules meter, version, "Copy install command", "Download" link); section "Skills working together" (3 recipes); section "Install a skill"; section "For agents" (copyable prompt, skills.json, llms.txt); section "Proof"; section "How a skill is made"; section "Limits"; footer.

Flow A: "Find a skill for my task". The visitor lands, reads the h1, wants to find out which skill suits their task (for example checking accessibility of a page). They use the hero search or the role filters or the skill chips, or scroll to the card grid. They open a card.
Flow B: "Check it is real". The visitor wonders whether the claims are true. They look at the "Real output from an agent" label, "Tested by a real agent: N of N cases pass", the rules meter, and the Proof section.
Flow C: "Install it". The visitor wants to use a skill: they use "Copy install command" on a card, or the "Install" nav link, or the Download link.
Flow D: "Understand what the product is". The visitor reads the hero and tries to say in one sentence what Skill Foundry is and who it is for.
