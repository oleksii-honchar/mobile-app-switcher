__mobile-app-switcher__

---

# Overview 
Deep link based tool to force open browser when wa is opened in fb app

# Dependencies & setup

- node@13
- aws-cli ([link](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html))

Target s3 bucket should be taken from TorStar confluence [page](https://smgdigital.atlassian.net/wiki/spaces/TOR/pages/528384391/Mobile+Application+Switcher). Make copy of `project.env.dist -> project.env` and put s3 bucket link there.

# How to deploy
```$xslt
npm run build
npm run deploy:s3
```

Public url
```$xslt
https://torstar-mobile-app-switcher.s3.eu-central-1.amazonaws.com/index.html
```