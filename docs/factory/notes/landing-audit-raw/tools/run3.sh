#!/bin/bash
IFS='|' read -r skill tag prompt <<< "$1"
S=/tmp/claude-0/-home-user-Skill-Foundry/349ad422-624c-5f35-8ca6-0680314406bf/scratchpad
cd $S/skillcopy/$skill || exit 1
claude -p "$prompt" --allowedTools Read Glob Grep Bash --add-dir $S/inputs --permission-mode dontAsk --output-format json > $S/raw/${skill}__${tag}.json 2>$S/raw/${skill}__${tag}.err
echo "finished $skill $tag $?"
