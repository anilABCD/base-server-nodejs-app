
###################################

    THIS COMMAND IS ENOUGH FOR WATHING ALL FILES :
    "start": "nodemon --ext js,graphql,html,json,pug,env --no-warnings --harmony-top-level-await ./dist/server.js",

    EXTENSIONS :

    RestoreTerminals : RestoreTerminals

###################################

    :::::::::::::::::: NOW NO NEED OF THESE :::::::::

    "watch-all-other-files": 
    "
    copy to terminal and run this command :
    watch -p '**/*.env' -p '*.env' -p '**/*.graphql' -p '**/*.html' -p '**\*.pug' -c 'npm run postbuild'
    "

    :::::::::::::::::::::::::::::::::::::::::::::::::

##################################

    Day to Day using this :

    cpy : on changes ... 

    install : cpy-cli :

    cpy **/*.env *.env  **/*.graphql **/*.html **/*.pug *.graphql *.html *.pug '!node_modules/**/*' '!dist/**/*' dist/ --cwd=./ --parents

    install : watch-cli : 

    watch -p '**/*.env' -p '*.env' -p '**/*.graphql' -p '**/*.html' -p '**\*.pug' -c 'npm run postbuild'

###################################

    "start": "nodemon --ext js,graphql,html,json,pug,env --no-warnings --harmony-top-level-await ./dist/server.js",
    "build": "tsc -p ./",
    "postbuild": "cpy **/*.env *.env  **/*.graphql **/*.html **/*.pug *.graphql *.html *.pug '!node_modules/**/*' '!dist/**/*' dist/ --cwd=./ --parents",
    "watch-all-other-files": "copy to terminal and run this command : watch -p '**/*.env' -p '*.env' -p '**/*.graphql' -p '**/*.html' -p '**/*.pug'  -c  'npm run postbuild'",
    "postbuild-with-config": "cpy **/*.graphql **/*.html **/*.env **/*.pug *.graphql *.html *.env *.pug '!node_modules/**/*' '!dist/**/*' dist/ --cwd=./ --parents"

###################################