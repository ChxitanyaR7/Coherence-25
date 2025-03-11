```markdown
# Firebase Connection Setup

1. **Login to Firebase**  
   Run the following command to log in to Firebase:
   ```bash
   firebase login
   ```

2. **Select Firebase Project**  
   Add and select the Firebase project:
   ```bash
   firebase use --add
   ```

3. **Initialize Firebase Project**  
   Initialize Firebase for your project:
   ```bash
   firebase init
   ```

4. **Set up Hosting**  
   When prompted:
   - **What do you want to use as your public directory?**  
     Enter `build`
   - **Configure as a single-page app (rewrite all URLs to /index.html)?**  
     Select `Yes`
   - **Set up automatic builds and deploys with GitHub?**  
     Select `No`
   - **File `build/index.html` already exists. Overwrite?**  
     Select `Yes`

   After confirming, Firebase will write the `build/index.html` file.

5. **Add Hosting Site Name**  
   Follow the prompts to set up the hosting site name.

6. **Build the Project**  
   Run the build script to create the production-ready build:
   ```bash
   npm run build
   ```

7. **Deploy to Firebase**  
   Deploy the build to Firebase Hosting:
   ```bash
   firebase deploy
   ```