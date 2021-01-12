#!/bin/bash

cd /Users/mitch/Projects/divy
code .
# osascript &>/dev/null <<EOF
#       tell application "iTerm"
#         activate
#         tell current window to set tb to create tab with default profile
#         tell current session of current window to write text "cd /Users/mitch/Projects/digtix-web-admin-api/react && npm run start"  
#       end tell
# EOF
npm run start