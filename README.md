watch-all-other-files :
"watch-all-other-files": "copy to terminal and run this command : watch -p '**/_.env' -p '_.env' -p '**/_.graphql' -p '\*\*/_.html' -p '\*_/_.pug' -c 'npm run postbuild'"

cpy :
npm i cpy-cli
"postbuild": "cpy **/_.env _.env **/_.graphql \*\*/_.html **/_.pug _.graphql _.html _.pug '!node_modules/**/_' '!dist/\*\*/_' dist/ --cwd=./ --parents",

###################################

watch-all-other-files :
"watch-all-other-files": "copy to terminal and run this command : watch -p '**/_.env' -p '_.env' -p '**/_.graphql' -p '\*\*/_.html' -p '\*_/_.pug' -c 'npm run postbuild'"

cpy :
npm i cpy-cli
"postbuild": "cpy **/_.env _.env **/_.graphql \*\*/_.html **/_.pug _.graphql _.html _.pug '!node_modules/**/_' '!dist/\*\*/_' dist/ --cwd=./ --parents",
