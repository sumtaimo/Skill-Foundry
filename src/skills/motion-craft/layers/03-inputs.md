# Layer 03: Inputs

1. Require only the subject. A style alone ("make it cinematic", "scroll like a video") is not a subject.
2. With no subject, reply with only this line and stop: `What is the page for, and what should a visitor remember or do at the end?`
3. When that user writes Khmer, reply with only this line and stop: `ទំព័រនេះសម្រាប់អ្វី ហើយអ្នកចង់ឱ្យអ្នកចូលមើលចងចាំ ឬធ្វើអ្វីនៅចុងបញ្ចប់?`
4. With no assets stated, plan with type, colour fields, hairlines and inline SVG / Canvas 2D / CSS 3D / Three.js plain geometry.
5. Select the stack tier from `references/stacks.md`:
   - **Tier 1 (default):** With no framework or motion library stated, ask for one standalone `index.html` with inline CSS and JavaScript and no libraries.
   - **Tier 2 (production stack):** When the user names a framework (React, Next.js, Vite, Astro) or motion libraries (GSAP, ScrollTrigger, Lenis, Three.js WebGL backdrop), keep their stack and apply the matching `references/stacks.md` profiles (P1–P4).
6. With no page language stated, use the language the user wrote in for visible copy.
7. Hand layer 04 the inputs, chosen stack tier, and the defaults taken.
