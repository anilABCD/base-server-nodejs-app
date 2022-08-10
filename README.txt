
extension :
restoreTerminals : restoreTerminals

###################################

"watch-all-other-files": "copy to terminal and run this command :

Day to Day using this :

watch -p '**/*.env' -p '*.env' -p '**/*.graphql' -p '**/*.html' -p '**\*.pug' -c 'npm run postbuild'


###################################

"start": "nodemon --watch **/*.graphql --watch **/*.env --ext js --no-warnings --harmony-top-level-await ./dist/server.js",
"old-used-start": "nodemon --ext js --no-warnings --harmony-top-level-await ./dist/server.js",
    "build": "tsc -p ./",
    "postbuild": "cpy **/*.env *.env  **/*.graphql **/*.html **/*.pug *.graphql *.html *.pug '!node_modules/**/*' '!dist/**/*' dist/ --cwd=./ --parents",
    "watch-all-other-files": "copy to terminal and run this command : watch -p '**/*.env' -p '*.env' -p '**/*.graphql' -p '**/*.html' -p '**/*.pug'  -c  'npm run postbuild'",
    "postbuild-with-config": "cpy **/*.graphql **/*.html **/*.env **/*.pug *.graphql *.html *.env *.pug '!node_modules/**/*' '!dist/**/*' dist/ --cwd=./ --parents"

// working ... 

###################################