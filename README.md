# Frontload

The frontend/client counterpart to [Backdraft](https://github.com/ImranR98/Backdraft). Far from complete; work in progress.

## TODO
- [x] Settings page with account info, change email, change password, and view/revoke logins
- [x] Restructure project - break entire-page components up into smaller units; separate 'page' components from individual 'component' components
- [x] Replace server-defined error messages with messages generated by client using error codes (allows for later internationalization)
- [x] Visual overhaul - replace bootstrap and flex-layout with material UI
    - [x] Initial replacement
    - [x] Make revoke login prompt a bootstrap modal
    - [x] Create password component (with params for passwordConfirm and if requirements should be enforced) and enforce requirement validation (in line with server)
    - [x] Make form validation under each field on submit instead of disabling submit entirely
- [ ] Add 'remember me' to login
- [ ] Internationalize client and add at least 1 other language (also need a way to determine default language and way to select language) - must be done for all strings in TS and template files
- [ ] Add dark mode toggle (light, dark, follow-system)
- [ ] Implement automated testing
- [ ] Create a proper README
- [ ] Revisit validation to see if it can be done without repetition in template