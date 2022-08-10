watch-all-other-files :
"watch-all-other-files": "copy to terminal and run this command : watch -p '**/_.env' -p '_.env' -p '**/_.graphql' -p '\*\*/_.html' -p '\*_/_.pug' -c 'npm run postbuild'"

cpy :
npm i cpy-cli
"postbuild": "cpy **/_.env _.env **/_.graphql \*\*/_.html **/_.pug _.graphql _.html _.pug '!node_modules/**/_' '!dist/\*\*/_' dist/ --cwd=./ --parents",

extension :
restoreTerminals : restoreTerminals

###################################

"watch-all-other-files": "copy to terminal and run this command :

Day to Day using this :

watch -p '**/*.env' -p '*.env' -p '**/*.graphql' -p '**/*.html' -p '**\*.pug' -c 'npm run postbuild'

"postbuild-with-config": "cpy **/_.graphql \*\*/_.html **/\*.env \*\*/_.pug _.graphql _.html _.env _.pug '!node_modules/\*\*/_' '!dist/\*_/_' dist/ --cwd=./ --parents"

###################################

watch-all-other-files :
"watch-all-other-files": "copy to terminal and run this command : watch -p '**/_.env' -p '_.env' -p '**/_.graphql' -p '\*\*/_.html' -p '\*_/_.pug' -c 'npm run postbuild'"

cpy :
npm i cpy-cli
"postbuild": "cpy **/_.env _.env **/_.graphql \*\*/_.html **/_.pug _.graphql _.html _.pug '!node_modules/**/_' '!dist/\*\*/_' dist/ --cwd=./ --parents",

extension :
restoreTerminals : restoreTerminals
