---
title: Making a PR
subtitle: Now that you know Git, it is time to send us your code
---
To create a Pull Request (PR) on GitHub, you need to follow a standard workflow that involves forking, cloning, branching, committing, pushing, and finally opening the PR.
Here is the complete step-by-step guide with the exact buttons you need to click:
## Step 1: Fork the Repository

   1. Navigate to the main GitHub page of the project you want to contribute to.
   2. In the top-right corner of the page, click the Fork button.
   3. Select your GitHub account as the owner.
   4. Click the green Create fork button. This creates a copy of the repository under your own GitHub account.

## Step 2: Clone Your Fork

   1. On your new fork page, click the green <> Code button.
   2. Copy the HTTPS or SSH URL provided.
   3. Open your terminal or command prompt and run:
   
   git clone <PASTE_URL_HERE>
   
   4. Move into the project directory:
   
   cd <REPOSITORY_NAME>
   
   
## Step 3: Create a New Branch
Never make changes directly to the main or master branch.

   1. In your terminal, create and switch to a new branch using a descriptive name:
   
   git checkout -b my-contribution-branch
   
   
## Step 4: Make Changes and Commit

   1. Open the project in your code editor and make your modifications.
   2. Save your files.
   3. In the terminal, stage your changes:
   
   git add .
   
   4. Commit your changes with a clear message:
   
   git commit -m "Fix: Describe the bug fix or feature here"
   
   
## Step 5: Push Changes to GitHub

   1. Upload your new branch and commits to your GitHub fork:
   
   git push origin my-contribution-branch
   
   
## Step 6: Create the Pull Request

   1. Go back to your browser and visit your fork on GitHub.
   2. You will see a yellow banner at the top saying you recently pushed a branch.
   3. Click the green Compare & pull request button.
   * Alternative: If you do not see the banner, click the Branches tab, find your branch, and click New pull request.
   4. On the PR creation page, ensure the base repository points to the original project and the head repository points to your fork and branch.
   5. Write a clear title and description explaining what changes you made and why.
   6. Click the green Create pull request button at the bottom of the form.
