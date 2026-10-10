---
title: Git and GitHub
subtitle: Where to upload each thing
---
**Git** is a piece of software that lets you save the changes you make to the code you are creating, so that if you change something that broke more than it fixed, you can easily go back.
**GitHub** is the most widely used platform for hosting repositories that use Git (i.e. the "folders" with code where we keep our changes, the project's evolution). With GitHub you can contribute to other repositories (hosting the code of other programs) and file bug reports.  

## Git
### Installing Git
Use [this AI chat so it explains exactly how to do it on your operating system](https://www.google.com/search?q=how+to+install+git+on+my+pc.+ask+the+user+whether+they+use+windows%2C+macos+or+which+linux+distro+and+give+the+exact+commands+in+the+language+they+referred+to+you+in+%28if+they+write+in+one+language%2C+you+reply+in+the+same+one%29.+first+message+in+english&udm=50)  

### Essential commands
To move to your project folder from the terminal you use the **cd** command. Learn more about it [in this AI chat](https://www.google.com/search?q=explain+to+the+user+how+to+use+the+CD+command%2C+asking+first+what+their+OS+is.+the+first+message+will+be+in+english+then+reply+in+whatever+language+they+write+in&udm=50)  

The first thing to do when entering the folder is to run **git init** to tell git you want to use it there, and it will start a repo.
When you make a series of changes to the code, run `git status` to see what you have not yet **committed** (tracked the change), then run `git add` plus the file or `git add .` for everything. Then run `git commit -m "your message"` and you are done!  

## GitHub
GitHub, as we said, lets you host the code you create and open Pull Requests.
First you need to create an account [by signing up from here, for example](https://github.com/signup)
Now [go to this chat so the AI explains how to configure your PC to push from git to GitHub](https://www.google.com/search?q=explain+to+the+user+how+to+set+up+ssh+on+their+system+and+github+to+push+to+their+repos.+the+user+is+learning%2C+was+redirected+from+help.inled.es+and+the+first+message+should+be+in+english%2C+then+continue+in+whatever+language+they+reply+in&udm=50)  

Now simply create a repository, copy the git@... URL shown when you click the Code button on the created repo (or the one given on creation), then run `git remote add origin git@...` and `git push origin main`