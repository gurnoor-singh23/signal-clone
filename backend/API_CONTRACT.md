POST   /auth/register        {phone, display\_name} -> {user, otp\_hint}

POST   /auth/verify-otp      {phone, otp} -> {token, user}

GET    /me                   -> current user

GET    /conversations        -> list, sorted by last activity

POST   /conversations        {type, member\_ids\[], name?} -> conversation

GET    /conversations/{id}/messages

POST   /contacts             {phone or username}

GET    /contacts

WS     /ws/{token}           -> realtime channel

